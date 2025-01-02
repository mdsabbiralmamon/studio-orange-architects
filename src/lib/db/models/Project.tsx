import mongoose, { Schema, model, Document } from "mongoose";

// Define the Project interface
export interface IProject extends Document {
  title: string;
  category: string;
  cover: { url: string; alt: string; name: string }; // Object with 'url', 'alt', and 'name' for the cover image
  images?: { url: string; alt: string; name: string }[]; // Array of objects, each containing 'url', 'alt', and 'name' for image paths (optional)
  description?: string; // Optional description
  mapLocation?: string; // Optional map location
  details?: {
    AppointmentYear?: string;
    CompletionYear?: string;
    Client?: string;
    Location?: string;
  };
  createdAt?: Date;
}

// Define the Project schema
const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    cover: {
      type: {
        url: { type: String, required: true },
        alt: { type: String, required: true }, // Added 'alt' field
        name: { type: String, required: true }, // Added 'name' field
      },
      required: true,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          alt: { type: String, required: true }, // Added 'alt' field
          name: { type: String, required: true }, // Added 'name' field
        },
      ],
      default: [],
    },
    description: { type: String },
    mapLocation: { type: String },
    details: {
      AppointmentYear: { type: String },
      CompletionYear: { type: String },
      Client: { type: String },
      Location: { type: String },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Project model
const Project = mongoose.models.Project || model<IProject>("Project", ProjectSchema);
export default Project;
