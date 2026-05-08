const User = require('../models/user.model');

exports.findUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};

exports.updateUser = async (userId, updateData) => {
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


const jwt = require('jsonwebtoken'); // need to install 

exports.createUser = async (userData) => {
    // Check if user already exists
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) throw new Error('User already exists');

    return await User.create(userData);
};

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    //should have a matchPassword method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate Token 
    const token = jwt.sign({ id: user._id }, 'Prerak', { expiresIn: '30d' });

    return { user, token };
};

exports.fetchAllUsers = async () => {
    return await User.find({}).select('-password');
};