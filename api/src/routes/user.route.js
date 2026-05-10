import express from "express";
import { register, login, googleLogin } from "../controllers/user.controller.js";

const router = express.Router();

// routes
router.post("/register", register);
router.post("/login", login);

// Google Auth route
router.post("/google-login", googleLogin);

export default router;