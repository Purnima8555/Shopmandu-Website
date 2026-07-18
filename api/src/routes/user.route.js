import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import { upload } from "../middleware/multer.middleware.js"
import { deleteUser, getAllUsers, getUserById, updateUserAvatar, updateUserName } from "../controllers/user.controller.js";

const router = Router();

// GET ALL USERS
router.get("/users/all", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllUsers);

// update username
router.patch("/user/update-name", auth, updateUserName);

// update avatar
router.patch("/user/update-avatar", auth, upload.single("avatar"), updateUserAvatar);

// GET USER BY ID
router.get("/users/:id", auth, getUserById);

// // UPDATE USER
// router.put("/users/", auth, upload.single("avatar"), updateUser);

// DELETE USER
router.delete("/users/", auth, deleteUser);

export default router;
