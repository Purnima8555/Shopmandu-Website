import express from "express";
import {
  createContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";

// If you have auth/role middleware (e.g. isAuthenticated, isAdmin/isVendor),
// wire it in front of getAllContacts and updateContactStatus so only staff
// can view/manage submissions. Left open here since I don't have that
// middleware file to match its exact naming.

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.patch("/:id/status", updateContactStatus);

export default router;
