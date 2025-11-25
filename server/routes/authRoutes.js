// server/routes/authRoutes.js
import express from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me); // protected route

export default router;
