

import z from "zod"

const timeregix = /^([01]\d|2[0-3]):([0-5]\d)$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const baseSchema = z.object({

    shopName: z.string().trim()
        .min(3, "Shop name must be at least 3 characters.")
        .max(80, "Shop name must not exceed 80 characters."),

    businessEmail: z.string().trim().regex(emailRegex, { message: "Invalid email address.", }),
    businessMobile: z.string().trim()
        .min(8, "Mobile number must be at least 8 digits.")
        .max(15, "Mobile number must not exceed 15 digits.")
        .optional(),

    shopAddress:
        z.object({
            location: z.string().trim()
                .min(3, "Location must be at least 3 characters.")
                .max(80, "Location must not exceed 80 characters."),
            city: z
                .string({
                    required_error: "City is required.",
                })
                .trim()
                .min(3, "City must be at least 3 characters.")
                .max(60, "City must not exceed 60 characters."),


            state: z.string().trim()
                .min(3, "State must be at least 3 characters.")
                .max(80, "State must not exceed 80 characters."),

            mobile: z.string().trim()
                .min(8, "Mobile number must be at least 8 digits.")
                .max(15, "Mobile number must not exceed 15 digits.")
                .optional(),

            pincode: z.string().trim().optional(),

            landmark: z.string().trim().optional(),
        }),

    description: z.string().trim()
        .min(3, "Shop description must be at least 3 characters.")
        .max(200, "Shop description must not exceed 200 characters.").optional(),

    openingHour: z.object({
        open: z.string()
            .regex(timeregix,"Opening time must be in HH:mm format."),
        close: z.string()
            .regex(timeregix,"Closing time must be in HH:mm format."),
    }).optional()

});

export const shopSchema = baseSchema.strict();
export const updateShopSchema = baseSchema.partial().strict()
