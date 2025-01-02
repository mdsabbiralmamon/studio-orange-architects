import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import connectDB from '@/lib/db/config/database';
import Media from '@/lib/db/models/Media';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to determine folder based on MIME type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('video/')) return 'videos';
  if (mimeType.startsWith('application/')) return 'documents';
  return 'others';
}

// Upload API
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ success: false, message: 'No file uploaded' });

    const mimeType = file.type || mime.lookup(file.name) || 'application/octet-stream';
    const fileCategory = getFileCategory(mimeType);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileCategory);

    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileCategory}/${uniqueFileName}`;

    const media = new Media({
      type: fileCategory,
      url: fileUrl,
      mimeType,
      title: formData.get('title')?.toString(),
      alt: formData.get('alt')?.toString(),
      originalFileName: file.name,
    });
    await media.save();

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      media,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Server Error' });
  }
};

// Edit API
export const PUT = async (req: NextRequest) => {
  try {
    await connectDB();
    const formData = await req.formData();
    const mediaId = formData.get('mediaId')?.toString();
    const file = formData.get('file') as File | null;
    const title = formData.get('title')?.toString();
    const alt = formData.get('alt')?.toString();

    if (!mediaId) return NextResponse.json({ success: false, message: 'Media ID is required.' });

    const media = await Media.findById(mediaId);
    if (!media) return NextResponse.json({ success: false, message: 'Media not found.' });

    const filePath = path.join(process.cwd(), 'public', media.url);
    let mimeType = media.mimeType;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      mimeType = file.type || mime.lookup(file.name) || 'application/octet-stream';
    }

    media.title = title || media.title;
    media.alt = alt || media.alt;
    media.mimeType = mimeType;

    await media.save();

    return NextResponse.json({
      success: true,
      message: 'Media updated successfully',
      media,
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ success: false, message: 'Server Error' });
  }
};
