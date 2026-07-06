import { z } from "zod";
import productStatus from "../../../api/src/constants/productStatus";

const categoryIdRegex = /^[0-9a-fA-F]{24}$/;

const formArray = (schema = z.string()) =>
    z.preprocess((value) => {
        if (typeof value === "string") {
            const trimmed = value.trim();
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed.map(v => String(v).trim());
                }
                return [String(parsed).trim()];
            } catch {
                return trimmed
                    .replace(/^\[|\]$/g, "")
                    .split(",")
                    .map(v => v.replace(/['"]/g, "").trim());
            }
        }
        return value;
    }, z.array(schema));



const productSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Product title is too short (minimum 3 characters required).")
        .max(80, "Product title is too long (maximum 80 characters allowed)."),

    slug: z.string()
        .trim()
        .toLowerCase()
        .min(1, "URL slug is required for SEO."),

    productStatus: z.enum([
        productStatus.ACTIVE,
        productStatus.INACTIVE,
        productStatus.OUT_OF_STOCK
    ], {
        errorMap: () => ({ message: "Please select a valid publication status." })
    }),

    shortDescription: z.string()
        .trim()
        .min(1, "Please provide a brief summary of the product for buyers.")
        .max(300, "Short description is too detailed (limit to 300 characters for optimal display)."),

    price: z.coerce.number()
        .gt(0, "Listing price must be a positive number greater than 0."),

    description: z.string()
        .trim()
        .min(10, "Please provide a more detailed product description (min 10 chars)."),

    discountPrice: z.coerce.number()
        .gte(0, "Discount price cannot be a negative value.")
        .optional(),

    discountPercent: z.coerce.number()
        .min(0, "Discount cannot be less than 0%.")
        .max(100, "Discount cannot exceed 100%.")
        .optional(),

    stock: z.coerce.number()
        .int("Stock quantity must be a whole number.")
        .gte(0, "Inventory stock cannot be negative."),

    colors: formArray(z.string()).optional(),

    sizes: formArray(z.string()).optional(),

    brand: z.string()
        .trim()
        .min(1, "Brand name is required.")
        .optional(),

    productWeight: z.coerce.number()
        .gt(0, "Product weight must be specified and greater than 0."),

    boxVolume: z.coerce.number()
        .gt(0, "Package volume must be specified and greater than 0."),

    categoryId: z.string()
        .regex(categoryIdRegex, "Please select a valid category from the list.")
        .optional()

}).refine((data) => {
    if (data.discountPrice !== undefined) {
        return data.discountPrice < data.price;
    }
    return true;
}, {
    message: "The discounted price must be lower than the original listing price.",
    path: ["discountPrice"]
}).refine((data) => {
    if (data.discountPrice !== undefined && data.discountPrice > 0 && data.discountPercent !== undefined && data.discountPercent > 0) {
        return false;
    }
    return true;
}, {
    message: " Please specify either a fixed Discount Price or a Discount Percentage, not both.",
    path: ["discountPercent"]
}).strict();

const updateProductSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Product title is too short (minimum 3 characters required).")
        .max(80, "Product title is too long (maximum 80 characters allowed)."),

    slug: z.string()
        .trim()
        .toLowerCase()
        .min(1, "URL slug is required for SEO."),

    productStatus: z.enum([
        productStatus.ACTIVE,
        productStatus.INACTIVE,
        productStatus.OUT_OF_STOCK
    ], {
        errorMap: () => ({ message: "Please select a valid publication status." })
    }),

    shortDescription: z.string()
        .trim()
        .max(200, "Short description should not exceed 200 characters.")
        .optional(),

    price: z.coerce.number()
        .gt(0, "Listing price must be a positive number greater than 0."),

    description: z.string()
        .trim()
        .min(10, "Please provide a more detailed product description (min 10 chars)."),

    discountPrice: z.coerce.number()
        .gte(0, "Discount price cannot be a negative value.")
        .optional(),

    discountPercent: z.coerce.number()
        .min(0, "Discount cannot be less than 0%.")
        .max(100, "Discount cannot exceed 100%.")
        .optional(),

    stock: z.coerce.number()
        .int("Stock quantity must be a whole number.")
        .gte(0, "Inventory stock cannot be negative."),

    colors: formArray(z.string()).optional(),

    sizes: formArray(z.string()).optional(),

    brand: z.string()
        .trim()
        .min(1, "Brand name is required.")
        .optional(),

    productWeight: z.coerce.number()
        .gt(0, "Product weight must be specified and greater than 0."),

    boxVolume: z.coerce.number()
        .gt(0, "Package volume must be specified and greater than 0."),

    categoryId: z.string()
        .regex(categoryIdRegex, "Please select a valid category from the list.")
        .optional()

}).refine((data) => {
    if (data.discountPrice !== undefined) {
        return data.discountPrice < data.price;
    }
    return true;
}, {
    message: "The discounted price must be lower than the original listing price.",
    path: ["discountPrice"]
}).refine((data) => {
    if (data.discountPrice !== undefined && data.discountPrice > 0 && data.discountPercent !== undefined && data.discountPercent > 0) {
        return false;
    }
    return true;
}, {
    message: " Please specify either a fixed Discount Price or a Discount Percentage, not both.",
    path: ["discountPercent"]
}).strict();

export { productSchema, updateProductSchema };


