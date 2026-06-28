import express from "express";
import auth from "../middleware/auth.middleware.js";
import Roles from "../constants/userRoles.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import { generateDescription } from "../controllers/ai.controller.js";

const router = express.Router();

router.post(
    "/generate-description",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    generateDescription,
);

export default router;
