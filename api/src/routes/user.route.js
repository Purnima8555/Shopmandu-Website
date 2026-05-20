import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUserById,
  // googleLogin,
  login,
  register,
  resetPassword,
  updateUser,
  verifyOtp,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Google Auth route
// router.post("/google-login", googleLogin);

// routes
router.post("/register", register);
router.post("/login", login);

// ─── Forgot Password (OTP flow) — no auth required ───────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// ─── User CRUD — auth required ────────────────────────────────────────────────
router.get("/all", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
