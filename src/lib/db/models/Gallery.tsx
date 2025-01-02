import mongoose, { Schema, model, Document } from "mongoose";

// Define the OfficeGallery interface
export interface IOfficeGallery extends Document {
  images: string[]; // Array of image URLs
}

// Define the OfficeGallery schema
const OfficeGallerySchema = new Schema<IOfficeGallery>(
  {
    images: {
      type: [String], // Array of strings for image URLs
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "OfficeGallery must have at least one image.",
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the OfficeGallery model
export const OfficeGallery = mongoose.models.OfficeGallery || model<IOfficeGallery>("OfficeGallery", OfficeGallerySchema);

// Define the GalleryImage interface
export interface IGalleryImage extends Document {
  images: string[]; // Array of image URLs
}

// Define the GalleryImage schema
const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    images: {
      type: [String], // Array of strings for image URLs
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "GalleryImage must have at least one image.",
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the GalleryImage model
export const GalleryImage = mongoose.models.GalleryImage || model<IGalleryImage>("GalleryImage", GalleryImageSchema);
