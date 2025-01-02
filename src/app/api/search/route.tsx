import connectDB from "@/lib/db/config/database";
import Post from "@/lib/db/models/Post";
import Product from "@/lib/db/models/products";
import Project from "@/lib/db/models/Project";
import { NextResponse } from "next/server";

// GET: Search across posts, projects, and products
export const GET = async (req: Request) => {
  try {
    // Ensure database connection
    await connectDB();

    // Parse query parameters for search and pagination
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || ""; // Search query
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default limit of 10

    // Validate page and limit values
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;

    // Check if query is empty
    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Fetch data from posts, projects, and products
    const [postResults, projectResults, productResults] = await Promise.all([
      Post.find({ title: { $regex: query, $options: "i" } })
        .sort({ createdAt: -1 })
        .skip((validPage - 1) * validLimit)
        .limit(validLimit),
      Project.find({ title: { $regex: query, $options: "i" } })
        .sort({ createdAt: -1 })
        .skip((validPage - 1) * validLimit)
        .limit(validLimit),
      Product.find({ name: { $regex: query, $options: "i" } })
        .sort({ createdAt: -1 })
        .skip((validPage - 1) * validLimit)
        .limit(validLimit),
    ]);

    // Combine results with type annotations and URLs
    const results = [
      ...postResults.map((item) => ({
        ...item._doc,
        type: "Post",
        url: `/journal/${item._id}`,
      })),
      ...projectResults.map((item) => ({
        ...item._doc,
        type: "Project",
        url: `/work/${item._id}`,
      })),
      ...productResults.map((item) => ({
        ...item._doc,
        type: "Product",
        url: `/etha/${item._id}`,
      })),
    ];

    // Calculate total items and pages for pagination
    const [totalPosts, totalProjects, totalProducts] = await Promise.all([
      Post.countDocuments({ title: { $regex: query, $options: "i" } }),
      Project.countDocuments({ title: { $regex: query, $options: "i" } }),
      Product.countDocuments({ name: { $regex: query, $options: "i" } }),
    ]);
    const totalItems = totalPosts + totalProjects + totalProducts;
    const totalPages = Math.ceil(totalItems / validLimit);

    // Return the response
    return NextResponse.json({
      success: true,
      results,
      currentPage: validPage,
      totalPages,
    });
  } catch (error) {
    console.error("Error during search:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to execute search.",
      },
      { status: 500 }
    );
  }
};
