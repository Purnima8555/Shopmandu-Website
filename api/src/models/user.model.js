


import mongoose from "mongoose";
import Roles from "../constants/userRoles.js";
import authProvider from "../constants/authProvider.js";

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: [true, "User name required"],
        minlength: [3, "User name must be at least 3 characters."],
        maxlength: [50, "User name must be a maximum of 50 characters."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required."],
        validate: {
            validator: function (value) {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return regex.test(value);
            },
            message: "Invalid email address."
        }
    },
    mobile: {
        type: Number,
        minlength: 8,
        maxlength: 15
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
    },
    authProvider: [{
        type: String,
        enum: [authProvider.LOCAL, authProvider.GOOGLE],
        default: authProvider.LOCAL,
        required: [true, "Auth Provider is required"]
    }],
    roles: [{
        type: String,
        enum: [Roles.USER_ROLE, Roles.VENDOR_ROLE, Roles.ADMIN_ROLE],
        required: [true, "Role is required."],
        default: Roles.USER_ROLE
    }],
    isVerify: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const UserModel = mongoose.model("User", userSchema);

export default UserModel;



