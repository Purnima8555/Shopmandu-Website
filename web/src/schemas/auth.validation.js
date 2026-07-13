import { z } from "zod";

/// for user login
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
export const loginSchema = z.object({
  email: z.email("please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


//// for user register
export const registerSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  mobile: z.string().min(10, "Mobile number is required"),
  roles: z.string().min(1, "Role is required"),

  password: z.string().min(6, "Password must be at least 6 characters")
    .regex(
      passwordRegex,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});


//// reset password schema 
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters")
      .regex(
        passwordRegex, "Password must contain uppercase, lowercase, number and special character"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

//// update username
export const updateUserName = z.object({
  userName: z.string().min(3, "User Name must be at least 3 characters.").max(80, "User Name is too long, max 80 characters allowed.")
});