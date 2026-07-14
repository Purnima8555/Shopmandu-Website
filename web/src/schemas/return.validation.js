import { z } from "zod";

export const createReturnRequestSchema = z.object({

    orderId: z.string().min(1, "Order is required."),

    orderItemId: z.string().min(1, "Order item is required."),

    productId: z.string().min(1, "Product is required."),

    quantity: z.coerce
        .number()
        .int()
        .min(1, "Quantity must be at least 1."),

    reason: z.enum([
        "DEFECTIVE",
        "WRONG_ITEM",
        "SIZE_ISSUE",
        "NOT_AS_DESCRIBED",
        "CHANGE_OF_MIND",
        "OTHER",
    ]),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters.")
        .optional()
        .or(z.literal("")),

    images: z.any().optional(),
});