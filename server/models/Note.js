import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: String,
    color: { type: String, default: "#fff" },
    pinned: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
