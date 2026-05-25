import z, { email, maxLength, minLength, regex } from "zod";

import { userSchema } from "./user.schema.js";
const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const loginSchema = z
  .object({
    email: z
      .string({ error: "Email is required." })
      .regex(emailRegex, { error: "Invalid email address." }),
    password: z.string(),
  });
  // .refine((data) => data.email || data.phone, {
  //   message: "Either email or phone is required.",
  //   path: ["email", "phone"],
  // });

export const registerSchema = userSchema;