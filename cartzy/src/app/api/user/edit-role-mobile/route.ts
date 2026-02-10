import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { role, mobile } = await request.json();
    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { role, mobile },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log("Edit role & mobile Error:", error);
    return NextResponse.json(
      { message: "Edit role & mobile Error" },
      { status: 500 }
    );
  }
}
