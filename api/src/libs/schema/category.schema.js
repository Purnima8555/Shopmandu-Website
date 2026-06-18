
import z from "zod"

const baseSchema = z.object({
    name: z.string().trim()
        .min(3, "category name must be at least 3 characters.")
        .max(50, "category name cannot exceed 50 characters."),
    slug: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().optional(),
    isActive: z.coerce.boolean().optional(),

})


export const categoryschema = baseSchema.strict();
export const updateCategorySchema = baseSchema.partial().strict()
