import { Skeleton, Spinner } from "@/components/ui/Skeleton";

export default function ServiceDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-sm font-medium text-slate-600">Loading service details...</p>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-40" />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-8">
          <div className="space-y-4">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-10 w-full max-w-xl" />
            <Skeleton className="h-10 w-4/5 max-w-lg" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-11/12 max-w-xl" />
          </div>

          {/* Hero image */}
          <Skeleton className="h-72 w-full rounded-3xl sm:h-96" />

          {/* Overview card */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <Skeleton className="h-7 w-72 max-w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <Skeleton className="h-5 w-64 max-w-full" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Skeleton className="mt-0.5 h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ card */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <Skeleton className="h-7 w-64 max-w-full" />
            <div className="space-y-4 divide-y divide-slate-100">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={index !== 0 ? "space-y-2 pt-4" : "space-y-2"}>
                  <Skeleton className="h-5 w-3/4 max-w-sm" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-11/12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft-lg">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-9 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related services */}
      <div className="space-y-6">
        <Skeleton className="h-7 w-56 max-w-full" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
