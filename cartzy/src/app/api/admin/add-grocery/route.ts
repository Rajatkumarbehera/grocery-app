import { auth } from "@/auth";
import uploadResult from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const unit = formData.get("unit") as string | null;
    const price = Number(formData.get("price"));
    const file = formData.get("image") as Blob | null;

    let imageUrl;

    if (file) {
      imageUrl = await uploadResult(file);
    }

    const grocery = await Grocery.create({
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });

    return NextResponse.json(
      { grocery, message: "Grocery added successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Add Grocery API Error:", error);
    return NextResponse.json(
      { message: "Failed to add grocery" },
      { status: 500 },
    );
  }
}
