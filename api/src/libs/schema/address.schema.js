


import z from "zod"
import addressType from "../../constants/addressType.js";

const addressSchema = z.object({
    addressType: z.enum([addressType.BILLING, addressType.HOME, addressType.OFFICE, addressType.PICKUP, addressType.SHOP, addressType.OTHER]),
    location: z.string().trim().min(3, "location must be at least 3 characters.")
        .max(80, "location cannot exceed 80 characters."),
    city: z.string().trim().min(3, "city name must be at least 3 characters.")
        .max(50, "city name cannot exceed 50 characters."),
    mobile: z.string().trim().min(8, "mobile number must be at least 8 digits.")
        .max(15, "mobile number cannot exceed 15 digits."),
    state: z.string().trim().min(3, "state name must be at least 3 characters.")
        .max(50, "state name cannot exceed 50 characters."),
    pincode: z.string().trim().min(2, "pincode must be at least 2 characters.")
        .max(20, "pincode cannot exceed 20 characters.")
        .optional(),
    landmark: z.string().trim().min(3, "landmark must be at least 3 characters.")
        .max(80, "landmark cannot exceed 80 characters.")
        .optional()
}).strip()

export default addressSchema;