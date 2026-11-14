import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  isValidAdminSession,
} from "@/lib/admin-session";

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi =
    pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/login/status";

  if (
    (isAdminPage && !isLoginPage) ||
    (isAdminApi && !isLoginApi)
  ) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await isValidAdminSession(token))) {
      if (isAdminApi) {
        return addSecurityHeaders(
          NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        );
      }

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      loginUrl.searchParams.set(
        "next",
        `${pathname}${request.nextUrl.search}`
      );
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return addSecurityHeaders(
    NextResponse.next({ request: { headers: requestHeaders } })
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
