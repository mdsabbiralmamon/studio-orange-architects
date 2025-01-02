import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import connectDB from '@/lib/db/config/database';
import Product from '@/lib/db/models/products';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  return 'others';
}

// Create a new product
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const description = formData.get('description')?.toString() || '';

    // Validation
    if (!name || price <= 0 || !description) {
      return NextResponse.json({
        success: false,
        message: 'Name, price, and description are required.',
      });
    }

    // Handle images
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const imageFile of imageFiles) {
      const mimeType = imageFile.type || 'application/octet-stream';
      const fileCategory = getFileCategory(mimeType);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileCategory);

      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      images.push(`/uploads/${fileCategory}/${uniqueFileName}`);
    }

    // Create a new product in the database
    const product = new Product({
      name,
      images,
      price,
      description,
    });

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      message: 'Server Error',
    });
  }
};
