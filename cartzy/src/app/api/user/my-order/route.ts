import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const orders = await Order.find({ user: session?.user?.id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });

    if (!orders) {
      return NextResponse.json(
        { message: "Orders not found" },
        { status: 400 },
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("Get Orders Error:", error);
    return NextResponse.json({ message: "Get Orders Error" }, { status: 500 });
  }
}
