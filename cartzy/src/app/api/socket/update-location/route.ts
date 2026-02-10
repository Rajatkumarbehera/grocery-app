import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { userId, location } = await request.json();

    if (!userId || !location) {
      return NextResponse.json(
        {
          message: "User or Location not found",
        },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(userId, { location });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 },
    );
  }
}
