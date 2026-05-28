<<<<<<< HEAD
import { z } from "zod";
import paymentMethod from "../../constants/paymentMethod.js";
=======


import z from "zod"
import paymentMethod from "../../constants/paymentMethod.js"
>>>>>>> 5ca6db8adc0e72c9aa5f9fa35772e1d749e1f498

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

    selectedColor: z.string().trim().optional(),

    selectedSize: z.string().trim().optional(),
    });

//
// CREATE ORDER SCHEMA
//
export const createOrderSchema = z.object({
  // order items
    items: z.array(orderItemValidationSchema).min(1, {
        message: "At least one item is required",
    }),

    // selected address
    addressId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid Address ObjectId",
    }),

    // optional coupon
    couponCode: z.string().trim().toUpperCase().optional(),

    // optional delivery note
    notes: z.string().trim().max(300).optional(),

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
