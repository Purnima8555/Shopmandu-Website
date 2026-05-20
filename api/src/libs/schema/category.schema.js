
import z from "zod"

const categoryschema = z.object({

    name: z.string().trim()
    .min(3, "category name must be at least 3 characters.")
    .max(50, "category name cannot exceed 50 characters."),
    slug: z.string().trim().lowercase().min(3).max(50),
    description: z.string().trim().optional(),
    isActive: z.coerce.boolean().default(true).optional(),

})


export default categoryschema;

