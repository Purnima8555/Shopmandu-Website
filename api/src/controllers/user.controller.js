import * as userService from "../services/user.service.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsersService();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserByIdService(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid ID format or Server Error" });
    }
};

// FORGOT PASSWORD 
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmailService(email);

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }


        res.status(200).json({ 
            success: true, 
            message: "User found! You can now proceed with sending a reset email." 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};