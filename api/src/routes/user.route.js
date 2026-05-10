import express from "express";
import { register, login, googleLogin, getAllUsers, getUserById, forgotPassword } from "../controllers/user.controller.js";

const router = express.Router();

// Google Auth route
router.post("/google-login", googleLogin);

// routes
router.post("/register", register);
router.post("/login", login);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.post("/forgot-password", forgotPassword);

export default router;