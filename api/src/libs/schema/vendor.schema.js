import { z } from "zod";
import addressType from "../../constants/addressType.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const vendorSchema = z.object({
  businessDetail: z.object({
    shopName: z.string().trim()
      .min(3, "Shop name must be at least 3 characters.")
      .max(80, "Shop name must not exceed 80 characters."),
    businessEmail: z.string().trim().regex(emailRegex, { message: "Invalid email address.", }),
    businessMobile: z.string().trim()
      .min(8, "Mobile number must be at least 8 digits.")
      .max(15, "Mobile number must not exceed 15 digits.")
      .optional(),
  }),
  bankDetails: z.object({
    accountNumber: z.string().trim().min(3, "Account number is required."),
    accountHolderName: z.string().trim()
      .min(3, "Account holder name must be at least 3 characters.")
      .max(50, "Account holder name must not exceed 50 characters."),
    bankName: z.string().trim()
      .min(3, "Bank name must be at least 3 characters.")
      .max(80, "Bank name must not exceed 80 characters."),
    branchName: z.string().trim().optional(),
  }),

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

citizenship: z.object({ 
              number: z.string({required_error:"Citizenship number is required."}).trim().min(1),
               dateOfBirth: z.coerce.date({required_error: "Date of Birth is required."}),
}),

  nidNumber: z.string({ required_error: "National Identification Number is required.", }).trim(),
  panNumber: z.string({required_error: "PAN number is required."}).trim()
  
});

export default vendorSchema;
