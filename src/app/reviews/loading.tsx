import { Skeleton, Spinner } from "@/components/ui/Skeleton";

export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb + header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Spinner />
            <p className="text-sm font-medium text-slate-600">Loading reviews...</p>
          </div>
          <Skeleton className="h-3 w-32 rounded-full" />
          <div className="max-w-3xl space-y-3">
            <Skeleton className="h-3 w-44 rounded-full" />
            <Skeleton className="h-10 w-full max-w-xl" />
            <Skeleton className="h-10 w-4/5 max-w-lg" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-5/6 max-w-xl" />
          </div>
        </div>

        {/* Rating summary */}
        <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-12">
          <div className="flex flex-col items-center gap-2 border-b border-slate-200 pb-5 md:col-span-3 md:items-start md:border-b-0 md:border-r md:pb-0 md:pr-5">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-3 md:col-span-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-5 md:col-span-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2 text-center">
                <Skeleton className="mx-auto h-6 w-10" />
                <Skeleton className="mx-auto h-3 w-14" />
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="ml-auto h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
