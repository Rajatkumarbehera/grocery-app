import connectDB from "@/lib/db";
import { serializeGroceries } from "@/lib/serialize";
import Grocery from "@/models/grocery.model";
import GroceryItemCard from "./GroceryItemCard";
import Image from "next/image";
import cartzy from "../../public/cartzy1.png";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.toLowerCase() || "";

  await connectDB();
  const filter = query
    ? {
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          // {
          //   category: {
          //     $regex: query,
          //     $options: "i",
          //   },
          // },
        ],
      }
    : {};
  const groceries = await Grocery.find(filter).lean();
  const serializedGroceries = serializeGroceries(groceries);

  if (serializedGroceries?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Image
          src={cartzy}
          alt="cartzy"
          height={230}
          width={230}
          className="opacity-60"
        />
        <p className="text-lg mt-4 text-gray-500">
          No search results found for "{query}"
        </p>
        <p className="mt-1 text-gray-400">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="m-6">
      {query ? (
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-bold text-3xl text-gray-700">Search results</h2>
          <p className="text-gray-500">
            Showing {serializedGroceries?.length} results for{" "}
            <span className="font-semibold">"{query}".</span>
          </p>
        </div>
      ) : (
        <h2 className="font-bold text-3xl text-gray-700 mb-6">All products</h2>
      )}
      <div className="grid grid-cols-6 gap-4">
        {serializedGroceries?.map((grocery, index) => (
          <GroceryItemCard key={index} item={grocery} />
        ))}
      </div>
    </div>
  );
}
