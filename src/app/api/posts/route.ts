import connectDB from "@/lib/db/config/database";
import Post from "@/lib/db/models/Post";
import { NextResponse } from "next/server";

// GET: Fetch paginated posts
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

    // Fetch paginated posts
    const totalPosts = await Post.countDocuments(); // Total number of posts
    const totalPages = Math.ceil(totalPosts / validLimit); // Calculate total pages
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((validPage - 1) * validLimit) // Skip documents for previous pages
      .limit(validLimit); // Limit the results to the specified amount

    // Return the response
    return NextResponse.json({
      success: true,
      posts,
      currentPage: validPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts.",
      },
      { status: 500 }
    );
  }
};
