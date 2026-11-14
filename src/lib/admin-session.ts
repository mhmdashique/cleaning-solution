import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_COOKIE_NAME = "planc_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export async function isValidAdminSession(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
      issuer: "planc-cleaning",
      audience: "planc-admin",
    });
    return payload.sub === "admin" && payload.role === "admin";
  } catch {
    return false;
  }
}
