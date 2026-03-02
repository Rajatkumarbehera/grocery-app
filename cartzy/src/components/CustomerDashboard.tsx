import GroceryCardSkeleton from "@/skeletons/GroceryCardSkeleton";
import { Suspense } from "react";
import CategorySlider from "./CategorySlider";
import FeatureProducts from "./FeatureProducts";
import HeroSection from "./HeroSection";

export default function CustomerDashboard() {
  return (
    <main>
      <HeroSection />
      <CategorySlider />
      <Suspense fallback={<GroceryCardSkeleton />}>
        <FeatureProducts />
      </Suspense>
    </main>
  );
}
