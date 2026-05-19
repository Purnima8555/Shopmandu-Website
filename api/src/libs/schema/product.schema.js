import z from "zod"



const productSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "product name length must be greater than 3.")
    .max(80, "name cannot exceed 80 characters."),
  slug: z.string().trim().toLowerCase(),
  shortDescription: z.string().trim().optional(),
  price: z.number().gt(0),
  description: z.string().trim(),
  discountPrice: z.number().gte(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  stock: z.number().int().gte(0),
  color: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  brand: z.string().trim().optional(),
}).refine((data) => { 
    if(data.discountPrice !== undefined) return data.discountPrice < data.price
    return true
 },
{ message: "discount price must be less than actual price."}
)

export default productSchema;

