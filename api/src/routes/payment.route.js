import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { createStripeSession, verifyStripePayment } from "../controllers/payment.controller.js";

const router = Router();

// create session
router.post("/stripe/create-session", auth, createStripeSession);

// verify payment
router.get("/stripe/verify", auth, verifyStripePayment);

export default router;