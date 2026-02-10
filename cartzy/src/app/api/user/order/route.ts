import { auth } from "@/auth";
import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { userId, items, paymentMethod, totalAmount, address } =
      await request.json();
    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "all credentials required" },
        { status: 400 },
      );
    }
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await emitEventHandler({
      event: "new-order",
      data: newOrder,
    });

    return NextResponse.json(newOrder, { status: 200 });
  } catch (error) {
    console.log("Order Error:", error);
    return NextResponse.json({ message: "Order Error" }, { status: 500 });
  }
}
