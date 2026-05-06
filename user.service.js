const User = require('../models/user.model');

exports.findUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

exports.updateUser = async (userId, updateData) => {
    // Only allow updating specific fields
    const allowedUpdates = ['name', 'email', 'phone']; 
    const updates = {};
    
    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) updates[key] = updateData[key];
    });

    return await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    
    // for this user model needs matchPassword method or something
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) throw new Error("Incorrect current password");

    user.password = newPassword;
    await user.save();
};

exports.deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};