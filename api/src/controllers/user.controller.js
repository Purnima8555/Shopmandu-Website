import * as userService from "../services/user.service.js";
import {
    registerSchema,
    loginSchema,
    googleLoginSchema,
    updateUserSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema,
} from "../libs/schemas/user.schema.js";
import validate from "../middlewares/validator.js";

// Google Login
export const googleLogin = [
    validate(googleLoginSchema),
    async (req, res) => {
        try {
        const result = await userService.googleLoginUser(req.body.idToken);
        res.status(200).json({
            message: "Google Login successful",
            ...result,
        });
        } catch (error) {
        console.error("Google Login Error:", error);
        res
            .status(error.status || 400)
            .json({ message: error.message || "Invalid Google token" });
        }
    },
];

// Register
export const register = [
    validate(registerSchema),
    async (req, res) => {
        try {
        const userData = await userService.registerUser(req.body);
        res.status(201).json({
            message: "User registered successfully",
            user: userData,
        });
        } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        }
    },
];

// Login
export const login = [
    validate(loginSchema),
    async (req, res) => {
        try {
        const result = await userService.loginUser(
            req.body.email,
            req.body.password,
        );
        res.status(200).json({
            message: "Login successful",
            ...result,
        });
        } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
        }
    },
];

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsersService();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserByIdService(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res
        .status(500)
        .json({ success: false, message: "Invalid ID format or Server Error" });
    }
};

// ─── Update ───────────────────────────────────────────────────────────────────
 
/**
 * PUT /users/:id
 * Requires authentication. Users can only update their own profile;
 * admins can update any profile.
 */
export const updateUser = [
    validate(updateUserSchema),
    async (req, res) => {
        try {
            const updated = await userService.updateUserService(
                req.user.id,        // from auth middleware
                req.params.id,      // target user
                req.body,
            );
            res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    },
];
 
// ─── Delete ───────────────────────────────────────────────────────────────────
 
/**
 * DELETE /users/:id
 * Requires authentication. Users can only delete their own account;
 * admins can delete any account.
 */
export const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUserService(
            req.user.id,    // from auth middleware
            req.params.id,  // target user
        );
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};
 
// ─── Forgot Password (OTP flow) ───────────────────────────────────────────────
 
/**
 * POST /users/forgot-password
 * Step 1 – Request an OTP. Always returns 200 to prevent email enumeration.
 */
export const forgotPassword = [
    validate(forgotPasswordSchema),
    async (req, res) => {
        try {
            await userService.sendForgotPasswordOtpService(req.body.email);
            res.status(200).json({
                success: true,
                message: "If that email is registered, an OTP has been sent.",
            });
        } catch (error) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    },
];
 
/**
 * POST /users/verify-otp
 * Step 2 – Verify the OTP.
 */
export const verifyOtp = [
    validate(verifyOtpSchema),
    async (req, res) => {
        try {
            await userService.verifyOtpService(req.body.email, req.body.otp);
            res.status(200).json({ success: true, message: "OTP verified. You may now reset your password." });
        } catch (error) {
            res.status(error.status || 400).json({ success: false, message: error.message });
        }
    },
];
 
/**
 * POST /users/reset-password
 * Step 3 – Set a new password after OTP verification.
 */
export const resetPassword = [
    validate(resetPasswordSchema),
    async (req, res) => {
        try {
            const { email, otp, newPassword } = req.body;
            await userService.resetPasswordService(email, otp, newPassword);
            res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
        } catch (error) {
            res.status(error.status || 400).json({ success: false, message: error.message });
        }
    },
];
