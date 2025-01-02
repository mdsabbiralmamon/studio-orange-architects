import mongoose, { Schema, model, Document } from "mongoose";

// Define the Product interface
export interface IProduct extends Document {
  name: string;
  images: string[]; // Array of image URLs
  price: number;
  description: string;
}

// Define the Product schema
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    images: {
      type: [String], // Array of strings for image URLs
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "A product must have at least one image.",
      },
    },
    price: { type: Number, required: true, min: 0 }, // Price must be a non-negative number
    description: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Product model
const Product = mongoose.models.Product || model<IProduct>("Product", ProductSchema);
export default Product;
