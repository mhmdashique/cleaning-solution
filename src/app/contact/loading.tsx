import { Spinner, Skeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm font-medium text-slate-600">Loading booking form...</p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 rounded-3xl bg-white p-8 lg:col-span-7">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Skeleton className="h-72 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
