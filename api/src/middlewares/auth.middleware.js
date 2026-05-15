import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // { id, role }
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;