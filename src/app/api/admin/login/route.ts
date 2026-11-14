import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminSessionCookieOptions,
  authenticateAdminPassword,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("password" in payload) ||
    typeof payload.password !== "string" ||
    payload.password.length > 1024
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = await authenticateAdminPassword(
    payload.password,
    request.headers
  );

  if (result.status === "unavailable") {
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 }
    );
  }

  if (result.status === "locked") {
    return NextResponse.json(
      {
        error: "locked",
        lockedUntil: result.lockedUntil,
        lockDurationSeconds: result.lockDurationSeconds,
        retryAfterSeconds: result.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfterSeconds) },
      }
    );
  }

  if (result.status === "invalid") {
    return NextResponse.json(
      { error: "invalid", attemptsLeft: result.attemptsLeft },
      { status: 401 }
    );
  }

  try {
    const token = await createAdminSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(
      ADMIN_COOKIE_NAME,
      token,
      adminSessionCookieOptions()
    );
    return response;
  } catch (error) {
    console.error("[admin-auth] Unable to create session", error);
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 }
    );
  }
}
