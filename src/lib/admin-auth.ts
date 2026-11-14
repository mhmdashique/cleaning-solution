import "server-only";

import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  isValidAdminSession,
} from "@/lib/admin-session";

export { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE_SECONDS };

const FAILURE_DELAY_MS = 400;
const PASSWORD_HASH_PATTERN = /^\$2[aby]\$\d\d\$/;

type LoginStatus = {
  locked: boolean;
  lockedUntil: number | null;
  lockDurationSeconds: number | null;
};

type FailedLoginResult = LoginStatus & {
  attemptsLeft: number;
  strikeLevel: number;
};

export type AdminLoginResult =
  | { status: "success" }
  | { status: "invalid"; attemptsLeft: number }
  | {
      status: "locked";
      lockedUntil: number;
      lockDurationSeconds: number;
      retryAfterSeconds: number;
    }
  | { status: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRpcRecord(value: unknown): Record<string, unknown> {
  const record = Array.isArray(value) ? value[0] : value;
  if (!isRecord(record)) {
    throw new Error("Admin login counter returned an invalid response.");
  }
  return record;
}

function parseLoginStatus(value: unknown): LoginStatus {
  const record = parseRpcRecord(value);
  if (
    typeof record.locked !== "boolean" ||
    (record.locked && typeof record.lockedUntil !== "number")
  ) {
    throw new Error("Admin login status returned an invalid response.");
  }
  return {
    locked: record.locked,
    lockedUntil:
      typeof record.lockedUntil === "number" ? record.lockedUntil : null,
    lockDurationSeconds:
      typeof record.lockDurationSeconds === "number"
        ? record.lockDurationSeconds
        : null,
  };
}

function parseFailedLoginResult(value: unknown): FailedLoginResult {
  const record = parseRpcRecord(value);
  const status = parseLoginStatus(record);
  if (
    typeof record.attemptsLeft !== "number" ||
    typeof record.strikeLevel !== "number"
  ) {
    throw new Error("Admin login counter returned an invalid response.");
  }
  return {
    ...status,
    attemptsLeft: record.attemptsLeft,
    strikeLevel: record.strikeLevel,
    lockDurationSeconds:
      typeof record.lockDurationSeconds === "number"
        ? record.lockDurationSeconds
        : status.locked
          ? durationForStrike(record.strikeLevel)
          : null,
  };
}

function durationForStrike(strikeLevel: number): number {
  if (strikeLevel <= 1) return 30;
  if (strikeLevel === 2) return 60;
  if (strikeLevel === 3) return 300;
  return 900;
}

function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

function getPasswordHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !PASSWORD_HASH_PATTERN.test(hash)) {
    throw new Error("ADMIN_PASSWORD_HASH must be a bcrypt hash.");
  }
  return hash;
}

function isCounterStoreConfigured(): boolean {
  return Boolean(
    supabaseAdmin &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getClientIdentity(requestHeaders: Headers) {
  const forwardedIp = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const ip = forwardedIp || requestHeaders.get("x-real-ip")?.trim() || "unknown";
  const userAgent = requestHeaders.get("user-agent") || "unknown";
  const key = createHash("sha256")
    .update(`${ip}\0${userAgent}`)
    .digest("hex");
  return { ip, key };
}

function maskIp(ip: string): string {
  if (ip === "unknown") return ip;
  if (ip.includes(".")) return ip.replace(/\.\d+$/, ".***");
  const segments = ip.split(":");
  return segments.length > 1
    ? `${segments.slice(0, 2).join(":")}:***`
    : "***";
}

async function getLoginStatus(clientKey: string): Promise<LoginStatus> {
  if (!isCounterStoreConfigured() || !supabaseAdmin) {
    throw new Error("Persistent admin login counter is not configured.");
  }
  const { data, error } = await supabaseAdmin.rpc("get_admin_login_status", {
    p_client_key: clientKey,
  });
  if (error) {
    throw new Error("Unable to read persistent admin login status.", {
      cause: error,
    });
  }
  return parseLoginStatus(data);
}

async function recordFailedLogin(
  clientKey: string
): Promise<FailedLoginResult> {
  if (!isCounterStoreConfigured() || !supabaseAdmin) {
    throw new Error("Persistent admin login counter is not configured.");
  }
  const { data, error } = await supabaseAdmin.rpc(
    "record_admin_login_failure",
    { p_client_key: clientKey }
  );
  if (error) {
    throw new Error("Unable to update persistent admin login status.", {
      cause: error,
    });
  }
  return parseFailedLoginResult(data);
}

async function resetFailedLogins(clientKey: string): Promise<void> {
  if (!isCounterStoreConfigured() || !supabaseAdmin) {
    throw new Error("Persistent admin login counter is not configured.");
  }
  const { error } = await supabaseAdmin.rpc("clear_admin_login_attempts", {
    p_client_key: clientKey,
  });
  if (error) {
    throw new Error("Unable to reset persistent admin login status.", {
      cause: error,
    });
  }
}

function isLocked(status: LoginStatus): status is LoginStatus & {
  lockedUntil: number;
} {
  return status.locked && status.lockedUntil !== null;
}

function makeLockedResult(
  lockedUntil: number,
  lockDurationSeconds: number
): AdminLoginResult {
  return {
    status: "locked",
    lockedUntil,
    lockDurationSeconds,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((lockedUntil - Date.now()) / 1000)
    ),
  };
}

function waitForFailureDelay(startedAt: number): Promise<void> {
  const remaining = FAILURE_DELAY_MS - (Date.now() - startedAt);
  return remaining > 0
    ? new Promise((resolve) => setTimeout(resolve, remaining))
    : Promise.resolve();
}

export async function getAdminLoginStatus(
  requestHeaders: Headers
): Promise<LoginStatus> {
  getPasswordHash();
  getSessionSecret();
  if (!isCounterStoreConfigured()) {
    throw new Error("Persistent admin login counter is not configured.");
  }
  const { key } = getClientIdentity(requestHeaders);
  return getLoginStatus(key);
}

export async function authenticateAdminPassword(
  password: string,
  requestHeaders: Headers
): Promise<AdminLoginResult> {
  try {
    const passwordHash = getPasswordHash();
    getSessionSecret();
    if (!isCounterStoreConfigured()) {
      throw new Error("Persistent admin login counter is not configured.");
    }

    const { ip, key } = getClientIdentity(requestHeaders);
    const currentStatus = await getLoginStatus(key);
    if (isLocked(currentStatus)) {
      return makeLockedResult(
        currentStatus.lockedUntil,
        currentStatus.lockDurationSeconds ?? 30
      );
    }

    const failureStartedAt = Date.now();
    const validPassword =
      Buffer.byteLength(password, "utf8") <= 72 &&
      (await bcrypt.compare(password, passwordHash));

    if (validPassword) {
      await resetFailedLogins(key);
      return { status: "success" };
    }

    const failedResult = await recordFailedLogin(key);
    await waitForFailureDelay(failureStartedAt);

    if (isLocked(failedResult)) {
      console.warn("[admin-auth] Login locked", {
        timestamp: new Date().toISOString(),
        ip: maskIp(ip),
        strikeLevel: failedResult.strikeLevel,
      });
      return makeLockedResult(
        failedResult.lockedUntil,
        failedResult.lockDurationSeconds ??
          durationForStrike(failedResult.strikeLevel)
      );
    }

    return {
      status: "invalid",
      attemptsLeft: failedResult.attemptsLeft,
    };
  } catch (error) {
    console.error("[admin-auth] Login unavailable", error);
    return { status: "unavailable" };
  }
}

export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("planc-cleaning")
    .setAudience("planc-admin")
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}
