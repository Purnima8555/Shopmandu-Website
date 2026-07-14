import { z } from "zod";

export const createCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters.")
    .max(30, "Coupon code cannot exceed 30 characters.")
    .transform((value) => value.toUpperCase()),

  discountType: z.enum(["PERCENTAGE", "FIXED"]),

  discountValue: z.coerce
    .number()
    .positive("Discount value must be greater than 0."),

  minOrderAmount: z.coerce
    .number()
    .min(0, "Minimum order amount cannot be negative."),

  maxDiscountAmount: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    return Number(value);
  }, z.number().min(0).nullable()),

  usageLimit: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    return Number(value);
  }, z.number().min(1).nullable()),

  perUserLimit: z.coerce.number().min(1, "Per user limit must be at least 1."),

  isActive: z.boolean(),

  expiresAt: z.string().min(1, "Expiry date is required."),
});
