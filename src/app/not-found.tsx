import Link from "next/link";
import { Sparkles, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-accent-yellow" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-slate-900 font-mono">
            404
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The page you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

