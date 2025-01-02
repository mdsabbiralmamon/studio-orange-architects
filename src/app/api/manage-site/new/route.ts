import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import connectDB from "@/lib/db/config/database";
import SiteInfo from "@/lib/db/models/SiteInfo";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to get file upload directory based on file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "images";
  return "others";
}

// POST: Create Site Info
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const contactNumber = formData.get("contactNumber")?.toString();
    const email = formData.get("email")?.toString();
    const mapLocation = formData.get("mapLocation")?.toString();
    const facebook = formData.get("facebook")?.toString();
    const instagram = formData.get("instagram")?.toString();
    const youtube = formData.get("youtube")?.toString();
    const twitter = formData.get("twitter")?.toString();
    const linkedin = formData.get("linkedin")?.toString(); // Added LinkedIn field

    // Validate required fields
    if (!name || !description || !email) {
      return NextResponse.json({
        success: false,
        message: "Name, description, and email are required.",
      });
    }

    // Process logo
    const logoFile = formData.get("logo") as File | null;
    let logoPath = "";
    if (logoFile) {
      const mimeType = logoFile.type || "application/octet-stream";
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${logoFile.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      logoPath = `/uploads/${fileCategory}/${uniqueFileName}`;
    }

    // Process studio images
    const studioImages: string[] = [];
    const studioImageFiles = formData.getAll("studioImages") as File[];
    for (const file of studioImageFiles) {
      const mimeType = file.type || "application/octet-stream";
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      studioImages.push(`/uploads/${fileCategory}/${uniqueFileName}`);
    }

    // Process navbar images
    const navbarImages: Record<string, { image: string }> = {};
    for (const section of ["Studio", "Work", "Product", "People", "Journal", "Contact"]) {
      const navbarFile = formData.get(`${section}Image`) as File | null;
      if (navbarFile) {
        const mimeType = navbarFile.type || "application/octet-stream";
        const fileCategory = getFileCategory(mimeType);
        const uploadDir = path.join(process.cwd(), "public", "uploads", fileCategory);

        await fs.mkdir(uploadDir, { recursive: true });

        const uniqueFileName = `${Date.now()}-${navbarFile.name}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        const buffer = Buffer.from(await navbarFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        navbarImages[section] = { image: `/uploads/${fileCategory}/${uniqueFileName}` };
      } else {
        navbarImages[section] = { image: "" }; // Default for missing files
      }
    }

    // Create and save site info
    const newSiteInfo = new SiteInfo({
      logo: logoPath,
      name,
      description,
      contactNumber,
      email,
      mapLocation,
      social: { facebook, instagram, youtube, twitter, linkedin }, // Include LinkedIn in the social object
      studioImages,
      navbarImages,
    });

    await newSiteInfo.save();

    return NextResponse.json({
      success: true,
      message: "Site info created successfully.",
    });
  } catch (error) {
    console.error("Error creating site info:", error);
    return NextResponse.json({
      success: false,
      message: "Server Error",
    });
  }
};
