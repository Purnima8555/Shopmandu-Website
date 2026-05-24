import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// GET ALL USERS
router.get("/users/all", auth, roleBasedAuth(Roles.ADMIN_ROLE, Roles.SUPER_ADMIN_ROLE), getAllUsers);

// GET USER BY ID
router.get("/users/:id", auth, getUserById);

// UPDATE USER
router.put("/users/:id", auth, updateUser);

// DELETE USER
router.delete("/users/:id", auth, deleteUser);

export default router;
