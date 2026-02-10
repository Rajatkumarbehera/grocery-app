import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import CategorySlider from "./CategorySlider";
import GroceryItemCard from "./GroceryItemCard";
import HeroSection from "./HeroSection";

export default async function CustomerDashboard({groceryList}:{groceryList: Grocery[]}) {
  await connectDB();
  // const groceries = await Grocery.find({}).lean();
  const plainGroceries = JSON.parse(JSON.stringify(groceryList));
  return (
    <div>
      <CategorySlider />
      <HeroSection />
      <div className="grid grid-cols-2 gap-6">
        {plainGroceries.map((grocery: any, index: number) => (
          <GroceryItemCard key={index} item={grocery} />
        ))}
      </div>
    </div>
  );
}
