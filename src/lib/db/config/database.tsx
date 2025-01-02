import mongoose from "mongoose";

/**
 * Connect to MongoDB
 * - This function establishes a connection to the MongoDB database using the URI defined in the environment variables.
 */
const connectDB = async (): Promise<boolean> => {
  // Check if there’s already an existing MongoDB connection
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB is already connected.");
    return true;
  }

  try {
    // Ensure the MongoDB URI is defined
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
    return true;
  } catch (error: unknown) {
    // Handle the error properly
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("An unknown error occurred while connecting to MongoDB:", error);
    }
    throw new Error("Failed to connect to MongoDB.");
  }
};

export default connectDB;

// Usage:
// Import and call this function in your server file (e.g., `server.ts`) to establish a database connection before starting the app.
