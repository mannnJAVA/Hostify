// server/server.js
import dotenv from "dotenv";
dotenv.config(); // must run before any module that reads process.env

console.log("DEBUG: JWT_SECRET loaded? ", !!process.env.JWT_SECRET);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";

const app = express();

// CORS — allow frontend and cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// IMPORTANT: body parser and cookie parser must be registered BEFORE routes
app.use(express.json());
app.use(cookieParser());

// Mount routes after parsers
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// Connect Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => res.send("Hostify API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
