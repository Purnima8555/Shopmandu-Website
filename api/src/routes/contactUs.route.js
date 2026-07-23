

/// contactUsEmailSend

import express from "express";
import { contactUsEmailSend } from "../controllers/contactUsEmail.controller.js";
import { readLimitingForContact } from "../middleware/rateLimiting.middleware.js";

const router = express.Router();

router.post(
  "/contact-us",
  readLimitingForContact,
  contactUsEmailSend
);

export default router;

