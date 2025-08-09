import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./auth.js";
import { connectDB } from "./db.js";
import { Note } from "./models/Note.js";
import { User } from "./models/User.js";
import { Folder } from "./models/Folder.js";

// TODO: Разбить логику на controllers, services, routes

dotenv.config();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const app = express();
await connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// AUTH ---- AUTH  ----- AUTH ---- AUTH

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, userData.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: userData._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/check-token", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "No Bearer token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// FOLDER CRUD ---- FOLDER CRUD ---- FOLDER CRUD ---- FOLDER CRUD

// Get all folders
app.get("/api/folders", auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId });
    res.json(folders);
  } catch (err) {
    console.error("GET /api/folders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create folder
app.post("/api/folders", auth, async (req, res) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      userId: req.userId,
    });
    res.status(201).json(folder);
  } catch (err) {
    console.error("POST /api/folders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update folder
app.patch("/api/folders/:id", auth, async (req, res) => {
  try {
    const updated = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name: req.body.name },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("PATCH /api/folders/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Delete folder
app.delete("/api/folders/:id", auth, async (req, res) => {
  try {
    const deleted = await Folder.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/folders/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// NOTE CRUD ---- NOTE CRUD ---- NOTE CRUD ----

// Get all notes or get by folder ID
app.get("/api/notes", auth, async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { userId: req.userId };
    if (folderId) query.folderId = folderId;

    const notes = await Note.find(query);
    res.json(notes);
  } catch (err) {
    console.error("GET /api/notes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create note
app.post("/api/notes", auth, async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      color: req.body.color || "#fff",
      pinned: req.body.pinned || false,
      folderId: req.body.folderId || null,
      userId: req.userId,
    });
    res.status(201).json(note);
  } catch (err) {
    console.error("POST /api/notes error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update note
app.patch("/api/notes/:id", auth, async (req, res) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("PATCH /api/notes/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete note
app.delete("/api/notes/:id", auth, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /api/notes/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running");
});
