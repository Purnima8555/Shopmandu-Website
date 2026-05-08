import express from "express";
import { getAllUsers, getUserById, forgotPassword } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/all", getAllUsers);           // GET /api/users/all
router.get("/:id", getUserById);           // GET /api/users/some_id_here
router.post("/forgot-password", forgotPassword); // POST /api/users/forgot-password

export default router;