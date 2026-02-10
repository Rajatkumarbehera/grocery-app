import uploadResult from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    const groceryId = formData.get("groceryId") as string | null;
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const unit = formData.get("unit") as string | null;
    const price = formData.get("price") as string | null;
    const file = formData.get("image") as Blob | null;

    let imageUrl;

    if (file) {
      imageUrl = await uploadResult(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId, {
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });

    return NextResponse.json(
      { grocery, message: "Grocery updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Grocery API Error:", error);
    return NextResponse.json(
      { message: "Failed to update grocery" },
      { status: 500 },
    );
  }
}
