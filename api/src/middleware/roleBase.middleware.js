
import { ForbiddenError } from "../utils/AppError.js";

const roleBasedAuth = (role) => (req, res, next) => {
  try {
    const hasRole = req.user?.roles?.includes(role);
    // console.log(hasRole);
    if (!hasRole) {
      throw new ForbiddenError("Access denied!");
    }
    // console.log("ok")
    next();
  } catch (error) {
    next(error); // pass error to express error handler
  }
};

export default roleBasedAuth;