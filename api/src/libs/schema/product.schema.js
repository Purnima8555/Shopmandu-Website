import z from "zod"
import productStatus from "../../constants/productStatus.js";


const formArray = (schema = z.string()) =>
    z.preprocess((value) => {
        if (typeof value === "string") {
            const trimmed = value.trim();
            try {
                const parsed = JSON.parse(trimmed);

                if (Array.isArray(parsed)) { //// it apply => ["red", "blue"]
                    return parsed.map(v => String(v).trim());
                }
                return [String(parsed).trim()];  /// it apply => green, red, yellow
            } catch {
                /// remove brackets if user sends bad format
                return trimmed
                    .replace(/^\[|\]$/g, "") // remove [ ]
                    .split(",")
                    .map(v => v.replace(/['"]/g, "").trim());
            }
        }
        return value;

    }, z.array(schema));


const productSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "product name length must be greater than 3.")
        .max(80, "name cannot exceed 80 characters."),
    slug: z.string().trim().toLowerCase(),
    productStatus: z.enum([productStatus.ACTIVE, productStatus.INACTIVE, productStatus.OUT_OF_STOCK]),
    shortDescription: z.string().trim().optional(),
    price: z.coerce.number().gt(0),
    description: z.string().trim(),
    discountPrice: z.coerce.number().gte(0).optional(),
    discountPercent: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().int().gte(0),
    colors: formArray(z.string()).optional(),
    sizes: formArray(z.string()).optional(),
    brand: z.string().trim().optional(),
    productWeight: z.coerce.number().gt(0),
    boxVolume: z.coerce.number().gt(0)
}).refine((data) => {
    if (data.discountPrice !== undefined) return data.discountPrice < data.price
    return true
},
    { message: "discount price must be less than actual price." }
).refine((data) => {
    /// if discountPrice and discountPercent are provided → invalid
    if (data.discountPrice !== undefined && data.discountPercent !== undefined) {
        return false;
    }
    return true;
}, {
    message: "You cannot provide both discountPrice and discountPercent at the same time."
}).strict();


const updateProductSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "product name length must be greater than 3.")
        .max(80, "name cannot exceed 80 characters.").optional(),
    slug: z.string().trim().toLowerCase().optional(),
    productStatus: z.enum([productStatus.ACTIVE, productStatus.INACTIVE, productStatus.OUT_OF_STOCK]).optional(),
    shortDescription: z.string().trim().optional(),
    price: z.coerce.number().gt(0).optional(),
    description: z.string().trim().optional(),
    discountPrice: z.coerce.number().gte(0).optional(),
    discountPercent: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().int().gte(0).optional(),
    colors: formArray(z.string()).optional(),
    sizes: formArray(z.string()).optional(),
    brand: z.string().trim().optional(),
    productWeight: z.coerce.number().gt(0).optional(),
    boxVolume: z.coerce.number().gt(0).optional()
}).refine((data) => {
    if (data.discountPrice !== undefined && data.price !== undefined) return data.discountPrice < data.price
    return true
},
    { message: "discount price must be less than actual price." }
).refine((data) => {
    /// if discountPrice and discountPercent are provided → invalid
    if (data.discountPrice !== undefined && data.discountPercent !== undefined) {
        return false;
    }
    return true;
}, {
    message: "You cannot provide both discountPrice and discountPercent at the same time."
}).strict();

export { productSchema, updateProductSchema };

