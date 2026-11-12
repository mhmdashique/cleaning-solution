import { Skeleton, Spinner } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm font-medium text-slate-600">Loading about PLAN C...</p>
        </div>

        {/* Intro + hero image */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-6">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-3 w-36 rounded-full" />
            <Skeleton className="h-10 w-full max-w-xl" />
            <Skeleton className="h-10 w-4/5 max-w-lg" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-11/12 max-w-lg" />
            <Skeleton className="h-4 w-3/4 max-w-md" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-11 w-44 rounded-full" />
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-[380px] w-full rounded-3xl sm:h-[460px] lg:col-span-6" />
        </div>

        {/* Mission / vision */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:p-10"
            >
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* Values grid */}
        <div className="space-y-10">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Skeleton className="mx-auto h-3 w-32 rounded-full" />
            <Skeleton className="mx-auto h-8 w-80 max-w-full" />
            <Skeleton className="mx-auto h-4 w-full max-w-xl" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft"
              >
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
