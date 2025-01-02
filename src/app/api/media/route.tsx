import connectDB from '@/lib/db/config/database';
import Media from '@/lib/db/models/Media';
import { NextResponse } from 'next/server';

export const GET = async () => { // Removed req parameter
  try {
    // Ensure DB connection
    await connectDB();

    // Fetch all media files from the database
    const files = await Media.find().sort({ createdAt: -1 }); // Sort by creation date (optional)

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch media files.' });
  }
};
