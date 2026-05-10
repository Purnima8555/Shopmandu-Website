import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: function () { return !this.googleId; },
        select: false
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    contact_no: {
        type: String
    },

    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer',
        required: true
    },

    image: {
        type: String,
        default: null
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;