import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import connectDB from '@/lib/db/config/database';
import Project from '@/lib/db/models/Project';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  if (mimeType.startsWith('application/')) return 'documents';
  return 'others';
}

// Create a new project
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const category = formData.get('category')?.toString();
    const description = formData.get('description')?.toString() || '';
    const mapLocation = formData.get('mapLocation')?.toString() || '';
    const details = JSON.parse(formData.get('details')?.toString() || '{}');

    // Validation
    if (!title || !category) {
      return NextResponse.json({
        success: false,
        message: 'Title and category are required.',
      });
    }

    // Handle cover image with alt and name
    const coverFile = formData.get('cover') as File | null;
    const coverAlt = formData.get('coverAlt')?.toString() || '';
    const coverName = formData.get('coverName')?.toString() || '';
    let coverUrl = '';
    if (coverFile) {
      const mimeType = coverFile.type || 'application/octet-stream';
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${coverFile.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      coverUrl = `/uploads/${fileCategory}/${uniqueFileName}`;
    }

    // Handle additional images with alt and name
    const images: { url: string; alt: string; name: string }[] = [];
    const imageFiles = formData.getAll('images') as File[];
    const imageAlts = formData.getAll('imageAlts') as string[];
    const imageNames = formData.getAll('imageNames') as string[];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const mimeType = imageFile.type || 'application/octet-stream';
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      images.push({
        url: `/uploads/${fileCategory}/${uniqueFileName}`,
        alt: imageAlts[i] || '',
        name: imageNames[i] || imageFile.name,
      });
    }

    // Create a new project in the database
    const project = new Project({
      title,
      category,
      cover: { url: coverUrl, alt: coverAlt, name: coverName },
      images,
      description,
      mapLocation,
      details,
    });

    await project.save();

    return NextResponse.json({
      success: true,
      message: 'Project created successfully.',
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({
      success: false,
      message: 'Server Error',
    });
  }
};
