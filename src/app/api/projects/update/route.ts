import connectDB from "@/lib/db/config/database";
import Project from "@/lib/db/models/Project";
import { NextResponse } from "next/server";

// PUT: Update a project by ID
export const PUT = async (req: Request) => {
  try {
    // Ensure database connection
    await connectDB();

    // Parse the request body
    const body = await req.json();
    const { id, title, category, cover, images } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID is required." },
        { status: 400 }
      );
    }

    // Find and update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, category, cover, images },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to update project." },
      { status: 500 }
    );
  }
};
