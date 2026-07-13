import z from "zod";

// Add Review
export const addReviewSchema = z.object({
    rating: z
        .number({
            required_error: "Rating is required.",
            invalid_type_error: "Rating must be a number.",
        })
        // .int("Rating must be a whole number.")
        .min(1, "Rating must be at least 1.")
        .max(5, "Rating cannot exceed 5."),

    comment: z
        .string({
            invalid_type_error: "Comment must be a string.",
        })
        .trim()
        .min(10, "Comment must be at least 10 characters.")
        .max(500, "Comment cannot exceed 500 characters.")
        .refine(
            (val) => !/(http|https|www\.)\S+/gi.test(val),
            "Links are not allowed."
        )
        .refine(
            (val) => !/(.)\1{4,}/.test(val),
            "Comment looks like spam."
        )
        .refine(
            (val) => !/\b[\w.-]+@[\w.-]+\.\w{2,}\b/.test(val),
            "Emails are not allowed."
        )
        .refine(
            (val) => !/(\+?\d[\s\-]?){9,13}\d/.test(val),
            "Phone numbers are not allowed."
        )
        .optional(),
});

// Edit Review
export const editReviewSchema = z
    .object({
        rating: z
            .number({
                invalid_type_error: "Rating must be a number.",
            })
            // .int("Rating must be a whole number.")
            .min(1, "Rating must be at least 1.")
            .max(5, "Rating cannot exceed 5.")
            .optional(),

        comment: z
            .string({
                invalid_type_error: "Comment must be a string.",
            })
            .trim()
            .max(500, "Comment cannot exceed 500 characters.")
            .optional(),
    })
    .refine(
        (data) =>
            data.rating !== undefined ||
            data.comment !== undefined,
        {
            message:
                "At least one of rating or comment must be provided.",
        }
    );