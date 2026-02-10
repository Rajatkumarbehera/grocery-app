import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId, OTP } = await req.json();

    if (!orderId || !OTP) {
      return NextResponse.json(
        {
          message: "OrderId or OTP not found",
        },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 400 },
      );
    }

    if (order.deliveryOTP !== OTP) {
      return NextResponse.json(
        {
          message: "Incorrect or expired OTP",
        },
        { status: 400 },
      );
    }

    order.status = "delivered";
    order.deliveryOTPVerification = true;
    order.deliveredAt = new Date();

    await order.save();

    await emitEventHandler({
      event: "order-status-update",
      data: {
        orderId: order._id,
        status: order.status,
      },
    });

    await DeliveryAssignment.updateOne(
      {
        order: orderId,
      },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      { message: "Delivered complete" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Verify OTP error: ${error}`,
      },
      { status: 400 },
    );
  }
}
