import { Skeleton } from "@/components/ui/skeleton";

export default function GroceryCardSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-4 m-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden ring-1 ring-gray-200 shadow-sm"
        >
          <Skeleton className="w-full aspect-square" />

          <div className="flex flex-col gap-1.5 px-3 pt-3">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
            <div className="flex items-baseline gap-1 mt-0.5">
              <Skeleton className="h-4 w-14 rounded" />
              <Skeleton className="h-3 w-10 rounded" />
            </div>
          </div>

          <div className="px-3 pt-2 pb-3">
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
