import { SectionSkeleton, Spinner } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pt-10 sm:px-6 lg:px-8">
        <Spinner />
        <p className="text-sm font-medium text-slate-600">Loading services...</p>
      </div>
      <SectionSkeleton />
    </div>
  );
}
