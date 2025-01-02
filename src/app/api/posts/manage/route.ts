import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import connectDB from "@/lib/db/config/database";
import Post from "@/lib/db/models/Post";

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for handling files manually
  },
};

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  return "others"; // Assuming images primarily
}

// POST: Create a new post
export const POST = async (req: NextRequest) => {
    try {
      await connectDB();
  
      const formData = await req.formData();
      const title = formData.get("title")?.toString();
      const topic = formData.get("topic")?.toString();
      const descriptions = formData.getAll("description").map((desc) => desc.toString());
      const coverFile = formData.get("cover") as File;
  
      // Validation
      if (!title || !topic || descriptions.length === 0 || descriptions.some((desc) => !desc.trim())) {
        return NextResponse.json({
          success: false,
          message: "Title, topic, and description are required.",
        });
      }
  
      // Handle cover image upload
      let cover = "";
      if (coverFile) {
        const mimeType = coverFile.type || "application/octet-stream";
        const fileCategory = getFileCategory(mimeType);
        const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);
  
        await fs.mkdir(uploadDir, { recursive: true });
  
        const uniqueFileName = `${Date.now()}-${coverFile.name}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        const buffer = Buffer.from(await coverFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);
  
        cover = `/uploads/${fileCategory}/${uniqueFileName}`;
      }
  
      // Create a new post in the database
      const newPost = new Post({
        title,
        cover,
        description: descriptions,
        topic,
      });
      const savedPost = await newPost.save();
  
      return NextResponse.json({
        success: true,
        message: "Post created successfully.",
        post: savedPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return NextResponse.json({
        success: false,
        message: "Server error.",
      });
    }
  };  

// DELETE: Delete a post by ID
export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    // Extract ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("Received ID:", id); // Log for debugging

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required." },
        { status: 400 }
      );
    }

    // Find and delete the post from the database
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    // Delete the associated cover image file from the server
    if (deletedPost.cover) {
      const filePath = path.join(process.cwd(), "public", deletedPost.cover);
      try {
        await fs.unlink(filePath); // Attempt to delete the cover image
        console.log(`Deleted cover image file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting cover image file (${filePath}):`, err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post and associated cover image deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
};
