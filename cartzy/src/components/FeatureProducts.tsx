import connectDB from "@/lib/db";
import { serializeGroceries } from "@/lib/serialize";
import Grocery from "@/models/grocery.model";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GroceryItemCard from "./GroceryItemCard";

export default async function FeatureProducts() {
  await connectDB();
  const groceries = await Grocery.find({}).lean();
  const serializedGroceries = serializeGroceries(groceries);
  return (
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
          href="/search"
          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {serializedGroceries?.map((grocery, index) => (
          <GroceryItemCard key={index} item={grocery} />
        ))}
      </div>
    </div>
  );
}
