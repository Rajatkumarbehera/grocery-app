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
    <div>
      <HeroSection />
      <CategorySlider />
      <div className="m-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
          Suggested for you
        </h2>
        <div className="grid grid-cols-6 gap-2">
          {groceries?.map((grocery, index) => (
            <GroceryItemCard key={index} item={grocery} />
          ))}
        </div>
      </div>
    </div>
  );
}
