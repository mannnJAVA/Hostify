// server/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Helper to create a signed token — now checks secret at runtime
function createToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    // Runtime error (will appear in logs) but doesn't crash the app at import time
    throw new Error(
      "JWT_SECRET is not set. Please add JWT_SECRET to your .env"
    );
  }
  const payload = { id: user._id, role: user.role, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// === Register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    // createToken will throw if secret missing (and we will catch it)
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error during registration." });
  }
}

// === Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error during login." });
  }
}

// === Logout
export function logout(req, res) {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  return res.json({ message: "Logged out" });
}

// === Me (protected)
export async function me(req, res) {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("Me error", err);
    return res.status(500).json({ message: "Server error." });
  }
}
