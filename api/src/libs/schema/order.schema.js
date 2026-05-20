import { z } from "zod";
import { OrderStatus, PaymentStatus } from "../../constants/orderStatus.js";

const orderItemValidationSchema = z.object({
    productId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Product ObjectId" }),
    quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
    selectedColor: z.string().optional(),
    selectedSize: z.string().optional(),
});

export const createOrderSchema = z.object({
  // Items payload
    items: z
        .array(orderItemValidationSchema)
        .min(1, { message: "Order must contain at least one item." }),

    // The selected Address ID from the user's saved addresses list
    addressId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Address ObjectId" }),

    // Payment option configuration
    paymentMethod: z.enum(["COD", "STRIPE", "ESEWA", "KHALTI"]).default("COD"),
});

// update the status via an API patch request route
export const updateOrderStatusSchema = z.object({
    orderStatus: z
        .enum([
        OrderStatus.PENDING,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
        ])
        .optional(),
    paymentStatus: z
        .enum([
        PaymentStatus.UNPAID,
        PaymentStatus.PAID,
        PaymentStatus.FAILED,
        PaymentStatus.REFUNDED,
        ])
    .optional(),
});
