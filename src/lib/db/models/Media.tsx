import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMedia extends Document {
  type: string;
  url: string;
  mimeType?: string;
  title?: string;
  alt?: string;
  originalFileName?: string; // Track original file name
  createdAt?: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    type: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String },
    title: { type: String },
    alt: { type: String },
    originalFileName: { type: String },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || model<IMedia>('Media', MediaSchema);
export default Media;
