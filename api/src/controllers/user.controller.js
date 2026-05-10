import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import * as userService from "../services/user.service.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { sub: googleId, email, name, picture } = ticket.getPayload();

        // Check if user exists (by googleId OR email)
        let user = await User.findOne({ 
            $or: [{ googleId: googleId }, { email: email }] 
        });

        if (!user) {
            user = new User({
                full_name: name,
                email: email,
                googleId: googleId,
                image: picture,
                role: "customer",
            });
            await user.save();
        } else if (!user.googleId) {

            // If user exists via email but never used Google, link them
            user.googleId = googleId;
            if (!user.image) user.image = picture;
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Google Login successful",
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: "Invalid Google token" });
    }
};

// Register Controller
export const register = async (req, res) => {
    const { full_name, email, password, confirmPassword, role } = req.body;

    try {
        if (!full_name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            full_name,
            email,
            password: hashedPassword,
            role: role || "customer"
        });

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to ShopMandu!!",
            html: `<h2>Welcome, ${full_name}!</h2><p>Your account has been successfully created.</p>`
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, full_name: user.full_name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, full_name: user.full_name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

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
        res.status(500).json({ success: false, message: "Invalid ID format or Server Error" });
    }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmailService(email);

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        res.status(200).json({
            success: true,
            message: "User found! You can now proceed with sending a reset email." 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};