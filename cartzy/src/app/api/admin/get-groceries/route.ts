import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // const session = await auth();

    const groceries = await Grocery.find({});

    if (groceries.length === 0) {
      return NextResponse.json(
        { message: "No grocery available" },
        { status: 400 },
      );
    }

    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    console.error("Fetch Grocery API Error:", error);
    return NextResponse.json(
      { message: `Failed to fetch groceries${error}` },
      { status: 500 },
    );
  }
}
