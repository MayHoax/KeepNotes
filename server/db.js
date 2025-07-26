import mongoose from "mongoose";

export async function connectDB(param) {
  try {
    await mongoose.connect(
      "mongodb+srv://deidaravalera:m0ng0n0tes@notesappcluster.v9uhoin.mongodb.net/?retryWrites=true&w=majority&appName=NotesAppCluster"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}
