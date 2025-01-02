import mongoose, { Schema, model, Document } from "mongoose";

// Define the SiteInfo interface
export interface ISiteInfo extends Document {
  logo: string; // File path for the logo image
  name: string;
  description: string;
  contactNumber?: string; // Optional contact number
  email: string;
  mapLocation?: string; // Optional map location
  social: {
    facebook?: string; // Optional, validate as URL
    instagram?: string; // Optional, validate as URL
    youtube?: string; // Optional, validate as URL
    twitter?: string; // Optional, validate as URL
    linkedin?: string; // Optional, validate as URL
  };
  studioImages: string[]; // Array of file paths for studio images
  navbarImages: {
    Studio: { image: string };
    Work: { image: string };
    Product: { image: string };
    People: { image: string };
    Journal: { image: string };
    Contact: { image: string };
  };
}

// Define the SiteInfo schema
const SiteInfoSchema = new Schema<ISiteInfo>(
  {
    logo: { type: String, required: true }, // Path to the logo file
    name: { type: String, required: true },
    description: { type: String, required: true },
    contactNumber: { type: String }, // Optional field
    email: { type: String, required: true },
    mapLocation: { type: String }, // Optional field
    social: {
      facebook: {
        type: String,
        validate: {
          validator: (v: string) => !v || /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i.test(v),
          message: "Invalid Facebook URL.",
        },
      },
      instagram: {
        type: String,
        validate: {
          validator: (v: string) => !v || /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i.test(v),
          message: "Invalid Instagram URL.",
        },
      },
      youtube: {
        type: String,
        validate: {
          validator: (v: string) => !v || /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i.test(v),
          message: "Invalid YouTube URL.",
        },
      },
      twitter: {
        type: String,
        validate: {
          validator: (v: string) => !v || /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i.test(v),
          message: "Invalid Twitter URL.",
        },
      },
      linkedin: {
        type: String,
        validate: {
          validator: (v: string) => !v || /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/.*)?$/i.test(v),
          message: "Invalid LinkedIn URL.",
        },
      },
    },
    studioImages: {
      type: [String], // Array of paths for studio images
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "At least one studio image is required.",
      },
    },
    navbarImages: {
      Studio: { image: { type: String, required: true } },
      Work: { image: { type: String, required: true } },
      Product: { image: { type: String, required: true } },
      People: { image: { type: String, required: true } },
      Journal: { image: { type: String, required: true } },
      Contact: { image: { type: String, required: true } },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the SiteInfo model
const SiteInfo = mongoose.models.SiteInfo || model<ISiteInfo>("SiteInfo", SiteInfoSchema);
export default SiteInfo;
