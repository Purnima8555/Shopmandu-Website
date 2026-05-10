import Customer from "../models/user.model.js";

// Get all users
export const getAllUsersService = async () => {
    return await Customer.find({});
};

// Get user by ID
export const getUserByIdService = async (id) => {
    return await Customer.findById(id);
};

// Find user by email (used for Forgot Password)
export const getUserByEmailService = async (email) => {
    return await Customer.findOne({ email });
};