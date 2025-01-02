import mongoose, { Schema, model, Document } from "mongoose";

// Define the Post interface
export interface IPost extends Document {
  title: string;
  cover: string;
  description: string[];
  topic: string;
}

// Define the Post schema
const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: [String], required: true }, // Array of strings
    topic: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Post model
const Post = mongoose.models.Post || model<IPost>("Post", PostSchema);
export default Post;
