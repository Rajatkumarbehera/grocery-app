import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        { status: 400 },
      );
    }

    const OTP = Math.floor(1000 + Math.random() * 9000).toString();

    order.deliveryOTP = OTP;

    await order.save();

    await sendMail(
      order.user.email,
      "Your Delivery OTP",
      `<h2>Your Delivery OTP is <strong>${OTP}</strong></h2>`,
    );

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `OTP error: ${error}`,
      },
      { status: 400 },
    );
  }
}
