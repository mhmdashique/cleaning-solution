import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") ?? "";

  if (pathname !== "/admin/login" && !(await checkAdminSession())) {
    redirect("/admin/login");
  }

  return children;
}
