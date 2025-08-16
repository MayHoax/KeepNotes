import mongoose from "mongoose";

export async function connectDB(param) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}
