import { SectionSkeleton, Spinner } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div className="bg-slate-50/50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-10 sm:px-6 lg:px-8">
        <Spinner />
        <p className="text-sm font-medium text-slate-600">Loading articles...</p>
      </div>
      <SectionSkeleton />
    </div>
  );
}
