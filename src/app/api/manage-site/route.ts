import connectDB from "@/lib/db/config/database";
import SiteInfo from "@/lib/db/models/SiteInfo";
import { NextResponse } from "next/server";

// GET: Fetch the site info
export const GET = async () => {
  try {
    // Ensure the database connection
    await connectDB();

    // Fetch the single SiteInfo record
    const siteInfo = await SiteInfo.findOne();
    if (!siteInfo) {
      return NextResponse.json(
        { success: false, message: "Site info not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, siteInfo });
  } catch (error) {
    console.error("Error fetching site info:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch site info." },
      { status: 500 }
    );
  }
};
