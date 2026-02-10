import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  // { params }: { params: { orderId: string } }
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    await connectDB();
    const { orderId } = await context.params;

    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log("Get Order Error:", error);
    return NextResponse.json({ message: "Get Order Error" }, { status: 500 });
  }
}
