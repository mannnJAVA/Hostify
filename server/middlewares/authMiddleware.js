// server/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  try {
    // 1) read token from cookies
    const token = req.cookies?.token;
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    // 2) get secret at runtime (ensure it's available)
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("Auth middleware: JWT_SECRET is missing");
      return res.status(500).json({ message: "Server auth misconfiguration" });
    }

    // 3) verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ message: "Not authorized" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}
