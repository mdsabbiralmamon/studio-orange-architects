import mongoose, { Schema, model, Document } from "mongoose";

// Define the People interface
export interface IPeople extends Document {
  name: string;
  role: string;
  image: string;
  category: string;
}

// Define the People schema
const PeopleSchema = new Schema<IPeople>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the People model
const People = mongoose.models.People || model<IPeople>("People", PeopleSchema);
export default People;
