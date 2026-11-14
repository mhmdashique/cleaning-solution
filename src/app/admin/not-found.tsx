import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-screen min-h-dvh items-center justify-center bg-[#F6F7FD] px-6 py-10 text-[#12201B]">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-[#E5E9E8] bg-white p-8 text-center shadow-[0_20px_56px_rgba(18,32,27,0.09)] sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2EC] text-[#0F6B52]">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-sm font-bold tracking-widest text-[#0F6B52]">
            404
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin page not found
          </h1>
          <p className="text-sm leading-relaxed text-[#5D6B65]">
            This admin page may have moved or the address may be incorrect.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F6B52] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B5944] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B52]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go to admin login
        </Link>
      </section>
    </main>
  );
}
