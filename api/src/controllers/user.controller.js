const userService = require('../services/user.service');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.user._id, req.body);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await userService.changePassword(req.user._id, currentPassword, newPassword);
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteUserAccount = async (req, res) => {
    try {
        await userService.deleteUser(req.user._id);
        res.status(200).json({ success: true, message: "Account deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// extract from req.body and sends it to service

exports.registerUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        // Usually, you'd generate a JWT token here as well
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.authenticateUser(email, password);
        res.status(200).json({ success: true, token, data: user });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};