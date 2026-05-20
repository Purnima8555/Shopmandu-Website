import z, { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
    try {
    schema.parse(req.body);

    next();
    } catch (error) {
    if (error instanceof ZodError) {
      // format zod error
        const formattedError = z.flattenError(error);

        return res.status(400).send(formattedError);
    }

    res.status(400).send(error);
    }
};

export default validate;
