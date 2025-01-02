import connectDB from "@/lib/db/config/database";
import User from "@/lib/db/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { serverStatus: "Error", message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { serverStatus: "Error", message: "User not found." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        { serverStatus: "Error", message: "Invalid password." },
        { status: 401 }
      );
    }

    // Securely create a user object for NextAuth
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Sign-In Error:", error);
    return NextResponse.json(
      { serverStatus: "Error", message: "Authentication failed." },
      { status: 500 }
    );
  }
}
