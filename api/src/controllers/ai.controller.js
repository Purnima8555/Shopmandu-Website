import aiService from "../services/ai.service.js";

const generateDescription = async (req, res, next) => {

    try {

        const description =
            await aiService.generateProductDescription(req.body);

        res.status(200).json({
            success: true,
            description
        });

    } catch (err) {
        next(err);
    }

};

export { generateDescription };