import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters.")
        .max(50, "Category name cannot exceed 50 characters."),

        slug: z
        .string()
        .trim()
        .regex(
        /^[a-z0-9-]*$/,
        "Slug can only contain lowercase letters, numbers and hyphens."
        )
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional()
        .or(z.literal("")),

    isActive: z.boolean(),
});
