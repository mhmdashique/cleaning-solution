import { Skeleton, Spinner } from "@/components/ui/Skeleton";

export default function BlogDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-sm font-medium text-slate-600">Loading article...</p>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-44" />
      </div>

      {/* Article header */}
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <Skeleton className="mx-auto h-7 w-28 rounded-full" />
        <Skeleton className="mx-auto h-10 w-full max-w-3xl" />
        <Skeleton className="mx-auto h-10 w-4/5 max-w-2xl" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Cover image */}
      <Skeleton className="mx-auto h-72 w-full max-w-5xl rounded-3xl sm:h-[460px]" />

      {/* Article + sidebar */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft sm:p-12 lg:col-span-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-3 border-t border-slate-100 pt-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-6 w-2/3 max-w-sm" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-slate-100 pt-6">
            <Skeleton className="h-6 w-1/2 max-w-xs" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-28">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3.5 flex-1" />
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-100 p-7 shadow-xl">
            <Skeleton className="h-5 w-44 bg-slate-200" />
            <Skeleton className="h-3.5 w-full bg-slate-200" />
            <Skeleton className="h-3.5 w-5/6 bg-slate-200" />
            <Skeleton className="h-11 w-full rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Related posts */}
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-7 w-52 max-w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft"
            >
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
