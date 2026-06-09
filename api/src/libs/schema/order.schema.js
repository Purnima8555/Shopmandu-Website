

import { z } from "zod";
import {paymentMethod} from "../../constants/paymentMethod.js"
import addressSchema from "./address.schema.js"

const createOrderSchema = z.object({

    products: z.array(
        z.object({
            productId: z.string(),
            quantity: z.coerce.number().gte(1, "Quantity must be at least 1"),
            color: z.string().optional(),
            size: z.string().optional()
        })
    ).min(1, "At least one item is required"),
    shippingAddress: addressSchema,
    couponCode: z.string().optional(),
    paymentMethod: z.enum([paymentMethod.CASH_ON_DELIVERY, paymentMethod.ONLINE])
}).strict();

export default createOrderSchema;