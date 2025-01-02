import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import connectDB from "@/lib/db/config/database";
import { GalleryImage } from "@/lib/db/models/Gallery";

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for handling files manually
  },
};

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  return "others"; // For other file types, but we are assuming only images here
}

// Create GeneralGallery
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const images = formData.getAll("images");

    // Validation
    if (!images || images.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Images must be a non-empty array.",
      });
    }

    // Handle images upload
    const uploadedImages: string[] = [];
    for (const imageFile of images) {
      const file = imageFile as File;
      const mimeType = file.type || "application/octet-stream";
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      uploadedImages.push(`/uploads/${fileCategory}/${uniqueFileName}`);
    }

    // Create GeneralGallery in the database with the uploaded image paths
    const newGallery = new GalleryImage({
      images: uploadedImages,
    });
    const savedGallery = await newGallery.save();

    return NextResponse.json({
      success: true,
      message: "GeneralGallery created successfully.",
      gallery: savedGallery,
    });
  } catch (error) {
    console.error("Error creating GeneralGallery:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE: Delete GeneralGallery by ID
export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();

    // Extract ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");


    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required." },
        { status: 400 }
      );
    }

    // Find and delete the gallery from the database
    const deletedGallery = await GalleryImage.findByIdAndDelete(id);
    if (!deletedGallery) {
      return NextResponse.json(
        { success: false, message: "GeneralGallery not found." },
        { status: 404 }
      );
    }

    // Delete associated image files from the server
    const imagesToDelete = deletedGallery.images || [];
    for (const imagePath of imagesToDelete) {
      const filePath = path.join(process.cwd(), "public", imagePath);
      try {
        await fs.unlink(filePath); // Attempt to delete the image file
        // console.log(`Deleted image file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting image file (${filePath}):`, err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "GeneralGallery and associated images deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting GeneralGallery:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
};
