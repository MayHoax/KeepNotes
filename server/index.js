import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "./db.js";
import { Note } from "./models/Note.js";
import { User } from "./models/User.js";

// TODO: Перенести в ENV ( JWT, PORT...)
// TODO: Разбить логику на controllers, services, routes

const PORT = 3000;
const JWT_TOKEN = "TESTJWT";
const app = express();
await connectDB();

app.use(express.json());

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
    const userData = User.findOne({ email });
    if (!userData) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, userData.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, JWT_TOKEN, {
      expiresIn: "30d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is running");
});
