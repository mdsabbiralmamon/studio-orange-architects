import connectDB from "@/lib/db/config/database";
import People from "@/lib/db/models/People";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a single person by ID
export const GET = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();

    const { id } = params; // Extract the ID from the URL parameters
    const person = await People.findById(id);

    if (!person) {
      return NextResponse.json(
        { success: false, message: "Person not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error("Error fetching person:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch person." },
      { status: 500 }
    );
  }
};
