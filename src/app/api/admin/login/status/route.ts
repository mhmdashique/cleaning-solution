import { NextResponse, type NextRequest } from "next/server";
import { getAdminLoginStatus } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const status = await getAdminLoginStatus(request.headers);
    return NextResponse.json(status);
  } catch (error) {
    console.error("[admin-auth] Unable to load login status", error);
    return NextResponse.json(
      { error: "Admin sign-in is temporarily unavailable." },
      { status: 503 }
    );
  }
}
