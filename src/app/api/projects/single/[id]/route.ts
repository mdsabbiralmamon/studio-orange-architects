import connectDB from "@/lib/db/config/database";
import Project from "@/lib/db/models/Project";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a single project by ID
export const GET = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();

    const { id } = params; // Extract the ID from the URL parameters
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project." },
      { status: 500 }
    );
  }
};
