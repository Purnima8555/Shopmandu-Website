
import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long.", })
        .regex(passwordRegex, {
            message:
                "Password must contain uppercase, lowercase, number and special characters.",
        })
}).strict();

export default resetPasswordSchema;
