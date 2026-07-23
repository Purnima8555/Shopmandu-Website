

import { z } from "zod";

export const contactUsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters long.")
      .max(100, "Full name cannot exceed 100 characters."),

    email: z
      .email("Please enter a valid email address.")
      .max(255, "Email address cannot exceed 255 characters."),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number must contain at least 10 digits.")
      .max(15, "Phone number cannot exceed 15 characters."),

    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters long.")
      .max(2000, "Message cannot exceed 2000 characters."),
  })
  .strip();
