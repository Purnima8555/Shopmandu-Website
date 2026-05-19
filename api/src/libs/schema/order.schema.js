import z from "zod"
import paymentMethod from "../../constants/paymentMethod"

const createOrderSchema = z.object({

    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().gte(1, "Quantity must be at least 1")
        })
    ).min(1, "At least one item is required"),

    shippingAddressId: z.string(),
    couponCode: z.string().optional(),
    paymentMethod: z.enum([paymentMethod.CASH_ON_DELIVERY,paymentMethod.ESEWA, paymentMethod.KHALTI,paymentMethod.STRIPE])

})