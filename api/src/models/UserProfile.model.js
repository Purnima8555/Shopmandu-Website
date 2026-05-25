


import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    // addresses: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Address"
    // }],


        active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

const UserProfileModel = mongoose.model("UserProfile", userProfileSchema);

export default UserProfileModel;



