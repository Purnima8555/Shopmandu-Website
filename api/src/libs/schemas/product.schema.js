import { z } from "zod";

export const productSchema = z.object({
    vendorId: z.string().nonempty("Vendor Id is required"),
    shopId: z.string().nonempty("Shop Id is required"),
    categoryId: z.string().nonempty("Product category is required"),
    name: z
        .string()
        .trim()
        .min(3, "Name length must be greater than 3")
        .max(80, "Name cannot exceed 80 characters"),
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .nonempty("Slug is required"),
    description: z
        .string()
        .trim()
        .nonempty("Product description is required"),
    shortDescription: z
        .string()
        .trim()
        .max(200, "Short description too long")
        .optional(),
    // Using string because form-data sends values as string
    price: z
        .string()
        .nonempty("Product price is required")
        .refine((value) => !isNaN(Number(value)), {
            message: "Price must be a valid number",
        })
        .refine((value) => Number(value) >= 0, {
            message: "Price cannot be negative",
        }),
    discountPrice: z
        .string()
        .optional()
        .refine(
            (value) =>
                value === undefined ||
                value === "" ||
                (!isNaN(Number(value)) && Number(value) >= 0),
            {
                message: "Discount price cannot be negative",
            }
        ),
    discountPercent: z
        .string()
        .optional()
        .refine(
            (value) =>
                value === undefined ||
                value === "" ||
                (!isNaN(Number(value)) &&
                    Number(value) >= 0 &&
                    Number(value) <= 99),
            {
                message: "Discount percent must be between 0 and 99",
            }
        ),
    stock: z
        .string()
        .nonempty("Product stock is required")
        .refine((value) => !isNaN(Number(value)), {
            message: "Stock must be a valid number",
        })
        .refine((value) => Number(value) >= 0, {
            message: "Stock cannot be negative",
        }),
    images: z.array(z.string()).optional().default([]),
    colors: z.array(z.string()).optional().default([]),
    sizes: z.array(z.string()).optional().default([]),
    brand: z.string().trim().optional(),
    rating: z
        .string()
        .optional()
        .refine(
            (value) =>
                value === undefined ||
                value === "" ||
                (!isNaN(Number(value)) &&
                    Number(value) >= 0 &&
                    Number(value) <= 5),
            {
                message: "Rating must be between 0 and 5",
            }
        ),

    totalReviews: z
        .string()
        .optional()
        .refine(
            (value) =>
                value === undefined ||
                value === "" ||
                (!isNaN(Number(value)) && Number(value) >= 0),
            {
                message: "Total reviews cannot be negative",
            }
        ),

    totalSold: z
        .string()
        .optional()
        .refine(
            (value) =>
                value === undefined ||
                value === "" ||
                (!isNaN(Number(value)) && Number(value) >= 0),
            {
                message: "Total sold cannot be negative",
            }
        ),
}).refine(
    (data) => {
        if (!data.discountPrice || data.discountPrice === "") return true;
        return Number(data.discountPrice) < Number(data.price);
    },
    {
        path: ["discountPrice"],
        message: "Discount price must be lower than original price",
    }
);