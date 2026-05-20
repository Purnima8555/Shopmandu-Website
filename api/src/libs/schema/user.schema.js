import { z } from "zod";
import Roles from "../../constants/userRoles.js";
import authProvider from "../../constants/authProvider.js";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const userSchema = z
  .object({
    userName: z.string().trim().min(3).max(50),

    email: z.string().regex(emailRegex, {
      message: "Invalid email address.",
    }),

    mobile: z.string().min(5).max(15),

    password: z
      .string()
      .min(6)
      .regex(passwordRegex, {
        message:
          "Password must contain uppercase, lowercase, number and special characters.",
      })
      .optional(),

    googleId: z.string().optional(),

    roles: z
      .enum([
        Roles.ADMIN_ROLE,
        Roles.USER_ROLE,
        Roles.VENDOR_ROLE,
        Roles.SUPER_ADMIN_ROLE,
      ])
      .default(Roles.USER_ROLE),

    authProvider: z
      .enum([authProvider.GOOGLE, authProvider.LOCAL])
      .default(authProvider.LOCAL),
  })

  .refine(
    (data) => {
      if (data.authProvider === authProvider.LOCAL) {
        return !!data.password;
      }

      if (data.authProvider === authProvider.GOOGLE) {
        return !!data.googleId;
      }

      return true;
    },
    {
      message: "Invalid authentication credentials.",
      path: ["password"],
    }
  );