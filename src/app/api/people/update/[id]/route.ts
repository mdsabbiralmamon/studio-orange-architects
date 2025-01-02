import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import connectDB from "@/lib/db/config/database";
import People from "@/lib/db/models/People";
// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  return "others";
}

// Update a person
export const PUT = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();
    const { id } = params;

    const person = await People.findById(id);
    if (!person) {
      return NextResponse.json({
        success: false,
        message: "Person not found.",
      });
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const role = formData.get("role")?.toString();
    const category = formData.get("category")?.toString();
    const removeImage = formData.get("removeImage") === "true"; // Flag to indicate if the image should be removed

    // Validation
    if (!name || !role || !category) {
      return NextResponse.json({
        success: false,
        message: "Name, role, and category are required.",
      });
    }

    // Handle image update or removal
    if (removeImage) {
      person.image = "";
    } else {
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

        person.image = `/uploads/${fileCategory}/${uniqueFileName}`;
      }
    }

    // Update person fields
    person.name = name;
    person.role = role;
    person.category = category;

    await person.save();

    return NextResponse.json({
      success: true,
      message: "Person updated successfully.",
      person,
    });
  } catch (error) {
    console.error("Error updating person:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
    });
  }
};
