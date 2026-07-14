import z from "zod";
import { userSchema } from "./user.schema.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

// LOGIN
export const loginSchema = z.object({
  email: z.string().regex(emailRegex, {
    message: "Invalid email address.",
  }),

  password: z.string(),
});

// REGISTER
export const registerSchema = userSchema;

// GOOGLE LOGIN
export const googleLoginSchema = z.object({
  idToken: z.string(),
});

// FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
  email: z.string().regex(emailRegex),
});

// VERIFY OTP
export const verifyOtpSchema = z.object({
  email: z.string().regex(emailRegex),

  otp: z.string().length(6),
});

// RESET PASSWORD
export const resetPasswordSchema = z
  .object({
    email: z.string().regex(emailRegex),

    otp: z.string().length(6),

    newPassword: z.string().regex(passwordRegex),

    confirmPassword: z.string(),
  })

  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// UPDATE
export const updateUserSchema = z.object({
  userName: z.string().trim().min(3).max(50).optional(),

  mobile: z.string().min(5).max(15).optional(),

  avatar: z.string().optional(),
});
