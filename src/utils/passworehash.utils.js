import bcrypt from "bcrypt";
import { BadRequestError } from "./AppError.js";

/// password hash method

/**
 * 
 * 
 * 
 */

const salt = bcrypt.genSaltSync(10);

const hashPassword = async (password) => { 
    return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => { 
    const isVerified = await bcrypt.compare(password, hashedPassword);
    // if (!isVerified) {
    //     throw new BadRequestError("doe's not match!");
    // }
    return isVerified;
};

export default {hashPassword, verifyPassword}
