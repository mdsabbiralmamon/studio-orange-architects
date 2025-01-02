import connectDB from '@/lib/db/config/database';
import Media from '@/lib/db/models/Media';
import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

// DELETE - Delete Media
export const DELETE = async (req: NextRequest) => {
  try {
    // Ensure DB connection
    await connectDB();

    // Extract mediaId from query params
    const url = new URL(req.url);
    const mediaId = url.searchParams.get('id');

    if (!mediaId) {
      return NextResponse.json({ success: false, message: 'Media ID is required' });
    }

    // Find media by ID
    const media = await Media.findById(mediaId);
    if (!media) {
      return NextResponse.json({ success: false, message: 'Media not found' });
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', media.url);

    // Attempt to delete the file from the server
    try {
      await fs.unlink(filePath); // Delete file from the filesystem
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Delete the media record from the database
    const deletedMedia = await Media.findByIdAndDelete(mediaId);
    if (!deletedMedia) {
      return NextResponse.json({ success: false, message: 'Failed to delete media from the database' });
    }

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ success: false, message: 'Server Error' });
  }
};
