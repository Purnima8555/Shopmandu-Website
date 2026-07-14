import z from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

const createReturnRequestSchema = z.object({
    orderId: objectIdSchema,
    orderItemId: objectIdSchema,
    productId: objectIdSchema,

    reason: z.enum([
        "DEFECTIVE",
        "WRONG_ITEM",
        "SIZE_ISSUE",
        "NOT_AS_DESCRIBED",
        "CHANGE_OF_MIND",
        "OTHER",
    ]),

    description: z.string().max(500).optional(),
    quantity: z.coerce.number().int().min(1).default(1),
});

export default createReturnRequestSchema;