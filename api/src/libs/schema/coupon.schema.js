import { z } from "zod";
import couponType from "../../constants/couponType.js";

const validator = (data, ctx) => {
    if (data?.discountType === couponType.PERCENTAGE && data.discountValue !== undefined && data?.discountValue > 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["discountValue"],
            message: "Percentage discount cannot exceed 100%.",
        });
    }
    if (data?.expiresAt !== undefined && data?.expiresAt <= new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["expiresAt"],
            message: "Expiration date must be in the future.",
        });
    }
    if (data?.usageLimit !== undefined && data?.perUserLimit !== undefined && data?.perUserLimit > data?.usageLimit) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["perUserLimit"],
            message: "Per-user limit cannot exceed total usage limit.",
        });
    }

    if (data.discountType === couponType.FIXED && data.minOrderAmount !== undefined && data.discountValue !== undefined && data.minOrderAmount < data.discountValue) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minOrderAmount"],
            message: "Minimum order amount must be greater than or equal to discount value.",
        });
    }

};

const baseSchema = z.object({
    code: z.string().trim().uppercase()
        .min(3, { message: "Coupon code must be at least 3 characters long." })
        .max(20, { message: "Coupon code cannot exceed 20 characters." }),
    discountType: z.enum([couponType.PERCENTAGE, couponType.FIXED]),
    discountValue: z.coerce.number().min(0, { message: "Discount value must be greater than or equal to 0." }),
    minOrderAmount: z.coerce.number().min(0, { message: "Minimum order amount must be greater than or equal to 0." }),
    maxDiscountAmount: z.coerce.number().min(0, { message: "Maximum discount amount must be greater than or equal to 0." }).default(0).optional(),
    usageLimit: z.coerce.number().min(0, { message: "Usage limit must be greater than or equal to 0." }).optional(),
    perUserLimit: z.coerce.number().min(0, { message: "Per-user limit must be greater than or equal to 0." }).optional(),
    isActive: z.boolean().default(true),
    expiresAt: z.coerce.date()
});

export const couponSchema = baseSchema.superRefine(validator).strict()
export const couponSchemaUpdate = baseSchema.partial().superRefine(validator).strict()