import connectDB from "@/lib/db/config/database";
import User from "@/lib/db/models/User";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to fetch all users.
 */
export async function GET() {
  try {
    // Connect to the MongoDB database
    await connectDB();

    // Retrieve all users from the database
    const users = await User.find();

    // Return the users with a success status
    return NextResponse.json(
      {
        serverStatus: "Success",
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return an error response
    return NextResponse.json(
      {
        serverStatus: "Error",
        message: error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 500 }
    );
  }
}
