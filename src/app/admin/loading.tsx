import { Skeleton, Spinner } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-dvh bg-[#F6F7F6] text-[#12201B]">
      <div className="flex min-h-dvh flex-col min-[821px]:grid min-[821px]:grid-cols-[256px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden w-[256px] shrink-0 flex-col justify-between border-r border-[#e3e8e5] bg-white min-[821px]:flex">
          <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center gap-3.5 border-b border-[#e9eeeb] pb-5">
              <Skeleton className="h-10 w-10 shrink-0 rounded-[13px]" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2.5 w-28" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />

            <div className="space-y-2 pt-1">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-2.5 w-32" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#e9eeeb] p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-h-dvh min-w-0 flex-1 flex-col bg-[#F6F7F6]">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4 border-b border-[#e3e8e5] bg-white/80 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1240px] flex-1 space-y-6 p-6 md:p-8">
            {/* Loading indicator */}
            <div className="flex items-center gap-3">
              <Spinner />
              <p className="text-sm font-medium text-[#5D6B65]">Loading operations hub...</p>
            </div>

            {/* Section header card */}
            <div className="rounded-2xl border border-[#E3E8E5] bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-3.5 w-64 max-w-full" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-2xl border border-[#E3E8E5] bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-9 w-9 rounded-xl" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>

            {/* Table / list card */}
            <div className="overflow-hidden rounded-2xl border border-[#E3E8E5] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E8E5] px-5 py-4">
                <Skeleton className="h-5 w-40" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-56 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="flex items-center gap-4 border-b border-[#EEF1EF] pb-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-3 flex-1" />
                  ))}
                </div>
                {Array.from({ length: 6 }).map((_, row) => (
                  <div
                    key={row}
                    className="flex items-center gap-4 border-b border-[#F3F5F4] py-4 last:border-b-0"
                  >
                    <div className="flex flex-[1.4] items-center gap-3">
                      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-32 max-w-full" />
                        <Skeleton className="h-2.5 w-24 max-w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-3.5 flex-1" />
                    <Skeleton className="h-3.5 flex-1" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-3.5 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
