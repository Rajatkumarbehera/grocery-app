import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { groceryId } = await request.json();
    const grocery = await Grocery.findByIdAndDelete(groceryId);

     if (!grocery) {
      return NextResponse.json(
        { message: "Grocery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { grocery, message: "Grocery deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Grocery API Error:", error);
    return NextResponse.json(
      { message: "Failed to delete grocery" },
      { status: 500 },
    );
  }
}
