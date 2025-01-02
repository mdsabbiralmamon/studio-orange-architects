import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import connectDB from "@/lib/db/config/database";
import People from "@/lib/db/models/People";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  return "others";
}

// Create a new person
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const role = formData.get("role")?.toString();
    const category = formData.get("category")?.toString();

    // Validation
    if (!name || !role || !category) {
      return NextResponse.json({
        success: false,
        message: "Name, role, and category are required.",
      });
    }

    // Handle image
    let image = "";
    const imageFile = formData.get("image") as File;

    if (imageFile) {
      const mimeType = imageFile.type || "application/octet-stream";
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      image = `/uploads/${fileCategory}/${uniqueFileName}`;
    }

    // Create a new person in the database
    const person = new People({
      name,
      role,
      image,
      category,
    });

    await person.save();

    return NextResponse.json({
      success: true,
      message: "Person created successfully.",
      person,
    });
  } catch (error) {
    console.error("Error creating person:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
    });
  }
};
