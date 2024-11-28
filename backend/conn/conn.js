import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.URI) {
      throw new Error("Database URI is not defined in environment variables.");
    }

    await mongoose.connect(process.env.URI);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
