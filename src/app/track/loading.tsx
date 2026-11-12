import { Spinner, Skeleton } from "@/components/ui/Skeleton";

export default function TrackLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-sm font-medium text-slate-600">Loading tracking page...</p>
      </div>
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  );
}
