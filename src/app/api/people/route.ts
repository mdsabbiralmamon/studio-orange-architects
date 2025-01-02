import connectDB from "@/lib/db/config/database";
import People from "@/lib/db/models/People";
import { NextResponse } from "next/server";

// GET: Fetch paginated people
export const GET = async (req: Request) => {
  try {
    // Ensure database connection
    await connectDB();

    // Parse query parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default limit of 10

    // Validate page and limit values
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;

    // Fetch paginated people
    const totalPeople = await People.countDocuments(); // Total number of people
    const totalPages = Math.ceil(totalPeople / validLimit); // Calculate total pages
    const people = await People.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((validPage - 1) * validLimit) // Skip documents for previous pages
      .limit(validLimit); // Limit the results to the specified amount

    // Return the response
    return NextResponse.json({
      success: true,
      people,
      currentPage: validPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching people:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch people.",
      },
      { status: 500 }
    );
  }
};
