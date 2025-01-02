import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db/config/database";
import SiteInfo from "@/lib/db/models/SiteInfo";

// Define the type for the 'images' field if it's not typed in the model
interface SiteInfoDocument {
  studioImages: string[]; // Array of image file paths for studio images
  navbarImages: { [key: string]: { image: string } }; // Object for navbar images with image paths
}

export const DELETE = async (req: NextRequest) => {
  try {
    // Connect to the database
    await connectDB();

    // Extract the studio ID from the request URL
    const { searchParams } = new URL(req.url);
    const studioId = searchParams.get("id");

    if (!studioId) {
      return NextResponse.json(
        { success: false, message: "Studio ID is required." },
        { status: 400 }
      );
    }

    // Find the studio information by ID
    const studio = await SiteInfo.findById(studioId) as SiteInfoDocument | null;

    if (!studio) {
      return NextResponse.json(
        { success: false, message: "Studio info not found." },
        { status: 404 }
      );
    }

    // Remove associated images from the file system
    const imageFolderPath = path.join(process.cwd(), "public", "uploads"); // Adjust path as necessary

    // Delete images from studioImages array
    if (studio.studioImages && Array.isArray(studio.studioImages)) {
      studio.studioImages.forEach((image: string) => {
        const imagePath = path.join(imageFolderPath, image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image from the file system
        }
      });
    }

    // Delete images from navbarImages object
    if (studio.navbarImages) {
      Object.values(studio.navbarImages).forEach((imageObj) => {
        const imagePath = path.join(imageFolderPath, imageObj.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image from the file system
        }
      });
    }

    // Delete the studio info document from the database
    await SiteInfo.findByIdAndDelete(studioId);

    return NextResponse.json({
      success: true,
      message: "Studio information and associated images deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting studio info and images:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};
