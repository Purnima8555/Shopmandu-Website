

import { ZodError } from "zod";
import qs from "qs";

const schemaValidator = (schema) => async (req, res, next) => {
    try {

        // console.log(req.body)

        ///// parse multipart/form-data nested fields
        if (req.is("multipart/form-data")) {
            req.body = qs.parse(req.body);
        }

        ///// validate request body
        const validatedData =
            await schema.parseAsync(req.body);

        // Replace with validated/sanitized data
        req.body = validatedData;

        next();

    } catch (error) {

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.flatten(),
            });
        }

        next(error);
    }
};

export default schemaValidator;