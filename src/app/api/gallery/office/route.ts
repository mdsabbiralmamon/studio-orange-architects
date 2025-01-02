import { NextResponse } from "next/server";
import connectDB from "@/lib/db/config/database";
import { OfficeGallery } from "@/lib/db/models/Gallery";

// GET: Fetch paginated OfficeGallery
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

    // Fetch paginated OfficeGallery
    const totalItems = await OfficeGallery.countDocuments(); // Total number of items
    const totalPages = Math.ceil(totalItems / validLimit); // Calculate total pages
    const galleries = await OfficeGallery.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((validPage - 1) * validLimit) // Skip documents for previous pages
      .limit(validLimit); // Limit the results to the specified amount

    // Return the response
    return NextResponse.json({
      success: true,
      galleries,
      currentPage: validPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching OfficeGallery:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch OfficeGallery.",
      },
      { status: 500 }
    );
  }
};
