import * as userService from "../services/user.service.js";
import {
    registerSchema,
    loginSchema,
    googleLoginSchema
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

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmailService(email);

        if (!user) {
        return res
            .status(404)
            .json({ message: "User with this email does not exist." });
    }

    res.status(200).json({
        success: true,
        message: "User found! You can now proceed with sending a reset email.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
