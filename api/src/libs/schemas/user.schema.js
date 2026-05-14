import z from "zod";
import { emailRegex, passwordRegex } from "../../constants/regex.js";

export const registerSchema = z.object({
    full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Password must contain uppercase, lowercase, number and special character"),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'vendor', 'admin']).default('customer').optional(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string(),
});

export const googleLoginSchema = z.object({
    idToken: z.string({ required_error: "Google ID token is required" }),
});
