import connectDB from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            { message: "Name, email and password are required" },
            { status: 400 }
        );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existUser = await User.findOne({ email: normalizedEmail });
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    if(password.length < 8) {
        return NextResponse.json(
            { message: "Password must be at least 8 characters long" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully", newUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("Register Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
