import SearchResults from "@/components/SearchResults";
import GroceryCardSkeleton from "@/skeletons/GroceryCardSkeleton";
import { Suspense } from "react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  return (
    <Suspense fallback={<GroceryCardSkeleton />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
