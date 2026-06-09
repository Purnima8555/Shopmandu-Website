import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import { BadRequestError, UnauthorizedError } from "./AppError.js";
import config from "../config/config.js";


// Secret key from environment variables
const secretKey = config.jwtSecret;

/**
 *
 * extracts the raw JWT token.
 */
const extractJwtToken = (token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  // Remove "Bearer " prefix if present

  if (token.startsWith("Bearer ")) {
    return token.slice(7);
  }
  return token;
};

/**
 *
 *
 * Generates a signed JWT
 *
 */
const signJwt = (payload) => {
  if (!payload) {
    throw new Error("Payload is required");
  }

  if (!secretKey) {
    throw new Error("JWT secret key is not defined");
  }

  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

/**
 *
 * Verifies a JWT and returns decoded data
 */

const verifyJwt = (token) => {
  try {
    const cleanToken = extractJwtToken(token);
    const decoded = jwt.verify(cleanToken, secretKey);

    return decoded;
  } catch (error) {
    if(error.name === "TokenExpiredError"){
      throw new UnauthorizedError("Token Expired pleas again Login");
      
    }
    throw new BadRequestError("Invalid token!");
  }
};

export { extractJwtToken, signJwt, verifyJwt };
