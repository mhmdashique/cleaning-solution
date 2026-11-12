type SkeletonProps = {
  className?: string;
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx("animate-pulse rounded-md bg-slate-200/80", className)}
    />
  );
}

export function SectionSkeleton({
  className,
  label = "Loading section...",
}: SkeletonProps & { label?: string }) {
  return (
    <div className={cx("py-16 md:py-20", className)}>
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <p className="text-sm font-medium text-slate-600">{label}</p>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-8 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5"
            >
              <Skeleton className="h-36 w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-2 h-9 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
        ? "h-10 w-10 border-[3px]"
        : "h-6 w-6 border-2";
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx(
        "inline-block animate-spin rounded-full border-slate-200 border-t-brand-700",
        sizeClass,
        className
      )}
    />
  );
}
