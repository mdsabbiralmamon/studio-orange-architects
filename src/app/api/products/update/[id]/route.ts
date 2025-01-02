import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import connectDB from '@/lib/db/config/database';
import Product from '@/lib/db/models/products';

// Helper to determine upload folder for a file type
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'images';
  return 'others';
}

// Update a product
export const PUT = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Product not found.',
      });
    }

    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const description = formData.get('description')?.toString() || '';
    const imagesToRemove = JSON.parse(formData.get('imagesToRemove')?.toString() || '[]');

    // Validation
    if (!name || price <= 0 || !description) {
      return NextResponse.json({
        success: false,
        message: 'Name, price, and description are required.',
      });
    }

    // Remove selected images
    product.images = product.images.filter((img: string) => !imagesToRemove.includes(img));

    // Handle new images
    const newImages: string[] = [];
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

      newImages.push(`/uploads/${fileCategory}/${uniqueFileName}`);
    }

    // Update product fields
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = [...product.images, ...newImages];

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      message: 'Server Error',
    });
  }
};
