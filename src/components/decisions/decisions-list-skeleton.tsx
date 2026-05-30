import { Skeleton } from "@/components/ui/skeleton";

export function DecisionsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-[8.5rem] w-full rounded-xl" />
      ))}
    </div>
  );
}
