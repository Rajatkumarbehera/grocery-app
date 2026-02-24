import { GroceryClient } from "@/types/grocery";
import CategorySlider from "./CategorySlider";
import GroceryItemCard from "./GroceryItemCard";
import HeroSection from "./HeroSection";

interface CustomerDashboardProps {
  groceries: GroceryClient[];
}

export default async function CustomerDashboard({
  groceries,
}: CustomerDashboardProps) {
  return (
    <div className="p-6">
      <CategorySlider />
      <HeroSection />
      <div className="grid grid-cols-6 gap-2">
        {groceries?.map((grocery, index) => (
          <GroceryItemCard key={index} item={grocery} />
        ))}
      </div>
    </div>
  );
}
