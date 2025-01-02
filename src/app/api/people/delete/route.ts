import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/config/database";
import People from "@/lib/db/models/People";

// DELETE: Delete a person by ID
export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const personId = searchParams.get("id");

    if (!personId) {
      return NextResponse.json(
        { success: false, message: "Person ID is required." },
        { status: 400 }
      );
    }

    const person = await People.findByIdAndDelete(personId);

    if (!person) {
      return NextResponse.json(
        { success: false, message: "Person not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Person deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting person:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};
