import connectDB from "@/lib/db/config/database";
import Project from "@/lib/db/models/Project";
import { NextRequest, NextResponse } from "next/server";

// PUT: Update an existing project by ID
export const PUT = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();

    const { id } = params; // Extract the ID from the URL parameters
    const body = await req.json(); // Get the updated data from the request body

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validations are applied
    });

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project." },
      { status: 500 }
    );
  }
};
