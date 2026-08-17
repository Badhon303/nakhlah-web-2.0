import { Skeleton } from "@/components/ui/skeleton";

const SectionHeaderSkeleton = () => (
  <div className="flex items-center justify-between px-1">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-5 w-16" />
  </div>
);

export function MissionListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4">
      <SectionHeaderSkeleton />
      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-12 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BadgeListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4">
      <SectionHeaderSkeleton />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border/60 p-4 last:border-b-0"
          >
            <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
