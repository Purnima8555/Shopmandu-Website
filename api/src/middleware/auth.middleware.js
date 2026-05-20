

import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/AppError.js";
import { verifyJwt } from "../utils/jwt.utils.js";


const auth = (req, res, next) => {

    const cookie = req.headers.cookie;

    if (!cookie) throw new UnauthorizedError("User not authorize");

    /// extract token from cookie
    const token = cookie.split("=")[1]

    if (!token) throw new UnauthorizedError("User not authorize");

    try {

        // token validate
        const data = verifyJwt(token);
        req.user = data
        next()
    } catch (error) {
        next(error)
    }

}


export default auth;