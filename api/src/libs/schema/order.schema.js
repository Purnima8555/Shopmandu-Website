import { z } from "zod";
import paymentMethod from "../../constants/paymentMethod.js";

//
// ORDER ITEM SCHEMA
//
const orderItemValidationSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid Product ObjectId",
    }),

    quantity: z.number().int().gte(1, {
        message: "Quantity must be at least 1",
    }),

    selectedColor: z.string().optional(),
    selectedSize: z.string().optional(),
});

//
// CREATE ORDER SCHEMA
//
export const createOrderSchema = z.object({
    // order items
    items: z.array(orderItemValidationSchema).min(1, {
        message: "At least one item is required",
    }),

    // shipping address
    shippingAddressId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid Address ObjectId",
    }),

    // optional coupon
    couponCode: z.string().optional(),

    // payment method
    paymentMethod: z
        .enum([
        paymentMethod.CASH_ON_DELIVERY,
        paymentMethod.ESEWA,
        paymentMethod.KHALTI,
        paymentMethod.STRIPE,
        ])
        .default(paymentMethod.CASH_ON_DELIVERY),
});
