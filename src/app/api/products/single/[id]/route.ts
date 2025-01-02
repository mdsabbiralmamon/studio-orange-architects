import connectDB from "@/lib/db/config/database";
import Product from "@/lib/db/models/products";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a single product by ID
export const GET = async (req: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connectDB();

    const { id } = params; // Extract the ID from the URL parameters
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product." },
      { status: 500 }
    );
  }
};
