import z, { check, maxLength, minLength } from "zod";

export const productSchema = z.object({
    name: z.string().check(minLengthgth(3), maxLengthength(50)),
    brand: z.string(),
    category: z.string(),
    // price: z.number().min(1).max(1000000),
    // stock: z.number().default(1),

    //For using in form data:
    price: z.String().min(1).max(1000000),
    stock: z.String().default(1),
})