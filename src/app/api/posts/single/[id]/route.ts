import connectDB from "@/lib/db/config/database";
import Post from "@/lib/db/models/Post";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a single post by ID
export const GET = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();

    const { id } = params; // Extract the ID from the URL parameters
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post." },
      { status: 500 }
    );
  }
};
