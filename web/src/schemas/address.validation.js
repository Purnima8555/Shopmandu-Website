import { z } from "zod";

export const addAddressSchema = z.object({
    addressType: z.enum([
        "HOME",
        "OFFICE",
        "BILLING",
        "SHOP",
        "PICKUP",
        "OTHER",
    ]),

    location: z
        .string()
        .trim()
        .min(3, "Location is required.")
        .max(150, "Location is too long."),

    city: z
        .string()
        .trim()
        .min(2, "City is required.")
        .max(50, "City name is too long."),

    state: z
        .string()
        .trim()
        .min(2, "State is required.")
        .max(50, "State name is too long."),

    mobile: z
        .string()
        .trim()
        .min(10, "Mobile number must be at least 10 digits.")
        .max(15, "Mobile number cannot exceed 15 digits."),

    pincode: z
        .string()
        .trim()
        .max(10, "Pincode is too long.")
        .optional(),

    landmark: z
        .string()
        .trim()
        .max(100, "Landmark is too long.")
        .optional(),

    isDefault: z.boolean(),
});