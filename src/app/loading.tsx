import { Spinner, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col bg-white">
      {/* Top progress indicator */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 overflow-hidden bg-brand-50">
        <div className="h-full w-1/3 animate-[loading-bar_1.2s_ease-in-out_infinite] bg-brand-600" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-600">
            Loading PLAN C experience...
          </p>
          <p className="text-xs text-slate-400">This should only take a moment.</p>
        </div>

        {/* Lightweight skeleton preview */}
        <div className="mt-12 w-full max-w-5xl space-y-8 opacity-70">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40 rounded-full" />
              <Skeleton className="h-10 w-full max-w-xl" />
              <Skeleton className="h-10 w-4/5 max-w-lg" />
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-5/6 max-w-md" />
              <Skeleton className="h-11 w-44 rounded-full" />
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
