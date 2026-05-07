import z, { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = z.treeifyError(error);
            res.status(400).send(formattedError);
        }
        res.status(400).send(error);
    }
}