import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
        message: "Unauthorized",
        });
    }

const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
        message: "Invalid token",
        });
    }
};

export default authMiddleware;
