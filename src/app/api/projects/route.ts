import connectDB from "@/lib/db/config/database";
import Project from "@/lib/db/models/Project";
import { NextResponse } from "next/server";

// GET: Fetch paginated projects
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

    // Fetch paginated projects
    const totalProjects = await Project.countDocuments(); // Total number of projects
    const totalPages = Math.ceil(totalProjects / validLimit); // Calculate total pages
    const projects = await Project.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((validPage - 1) * validLimit) // Skip documents for previous pages
      .limit(validLimit); // Limit the results to the specified amount

    // Return the response
    return NextResponse.json({
      success: true,
      projects,
      currentPage: validPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects.",
      },
      { status: 500 }
    );
  }
};
