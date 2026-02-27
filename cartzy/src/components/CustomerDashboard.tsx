import { GroceryClient } from "@/types/grocery";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              Suggested for you
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Handpicked fresh from local farms
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {groceries?.map((grocery, index) => (
            <GroceryItemCard key={index} item={grocery} />
          ))}
        </div>
      </div>
    </div>
  );
}
