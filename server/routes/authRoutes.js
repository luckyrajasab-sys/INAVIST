import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../data/db.js";
import { generateToken, authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user);
  const { passwordHash, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// POST /api/auth/demo-login
router.post("/demo-login", (req, res) => {
  const user = db.users.find((u) => u.email === "arjun@yatri.com") || db.users[1];
  const token = generateToken(user);
  const { passwordHash, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// POST /api/auth/admin-login
router.post("/admin-login", (req, res) => {
  const user = db.users.find((u) => u.role === "admin") || db.users[0];
  const token = generateToken(user);
  const { passwordHash, ...userSafe } = user;
  res.json({ token, user: userSafe });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password, homeCity } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    role: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    isVerified: true,
    verificationType: "Government ID Verified (Simulated)",
    homeCity: homeCity || "India",
    createdAt: new Date().toISOString().split("T")[0]
  };

  db.users.push(newUser);
  const token = generateToken(newUser);
  const { passwordHash, ...userSafe } = newUser;
  res.status(201).json({ token, user: userSafe });
});

// GET /api/auth/me
router.get("/me", authenticateJWT, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { passwordHash, ...userSafe } = user;
  res.json({ user: userSafe });
});

export default router;
