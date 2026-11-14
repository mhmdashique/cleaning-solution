import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PasscodeGate from "@/components/admin/PasscodeGate";
import { checkAdminSession } from "@/lib/admin-auth";
import { getSafeAdminNext } from "@/lib/admin-path";

export const metadata: Metadata = {
  title: "Admin Sign In | PLAN C Cleaning Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  if (await checkAdminSession()) {
    redirect("/admin");
  }

  const params = await searchParams;
  return <PasscodeGate nextPath={getSafeAdminNext(params.next)} />;
}
