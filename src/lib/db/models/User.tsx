import mongoose, { Schema, model, Document } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password?: string;
  createdAt?: Date;
}

// Define the User schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" }, // Default role is "user"
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the User model
const User = mongoose.models.User || model<IUser>("User", UserSchema);
export default User;
