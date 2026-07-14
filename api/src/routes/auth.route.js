


import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { loginSchema, registerSchema } from "../libs/schema/auth.js";
import { upload } from "../middleware/multer.middleware.js";
import resetPasswordSchema from "../libs/schema/resetPassword.schema.js";
import readLimiting from "../middleware/rateLimiting.middleware.js";
import auth from "../middleware/auth.middleware.js";

const router= Router()

router.get("/me", auth, authController.getme);
router.post("/logout", authController.logout)

router.use(readLimiting)

router.post("/register", upload.single("avatar"), schemaValidator(registerSchema), authController.register);

router.get("/register", authController.googleLoginLink)
router.get("/register/google", authController.continueWithGoogle);



router.post("/verify-email", authController.verifyEmail)
router.post("/resent-otp", authController.resendOtp)
router.post("/login", schemaValidator(loginSchema), authController.logIn)

router.post("/forget-password", authController.forgetPasswordRequest)
router.post("/reset-password", schemaValidator(resetPasswordSchema),  authController.resetPasswordRequest)

export default router;