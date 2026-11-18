const express = require("express");
const rateLimit = require("express-rate-limit");

const { signup, login, getMe } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Signup rate limiter
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many signup attempts. Try again later.",
  },
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

// Public routes
router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);

// Protected routes
router.get("/me", authenticateToken, getMe);

module.exports = router;