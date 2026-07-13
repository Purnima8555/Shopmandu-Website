
import z from "zod"

const vendorkycSchema = z.object({

    fullName: z.string().trim().min(3).max(50),
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
    citizenship: z.object({
        number: z.string({ required_error: "Citizenship number is required." }).trim().min(1),
        dateOfBirth: z.coerce.date({ required_error: "Date of Birth is required." }),
    }),
    nidNumber: z.string({ required_error: "National Identification Number is required.", }).trim(),
    panNumber: z.string({ required_error: "PAN number is required." }).trim()

}).strict()

export default vendorkycSchema;

