import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({

    shopName: {
        type: String,
        required: [true, "Shop name is required."]
    },

    businessEmail: {
        type: String,
        required: [true, "Business email is required."],
        validate: {
            validator: function (value) {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return regex.test(value);
            },
            message: "Invalid email address.",
        },
    },

    businessMobile: {
        type: String,
    },

    accountStatus: {
        type: String,
        enum: [
            AccountStatus.ACTIVE_STATUS,
            AccountStatus.PENDING_STATUS,
            AccountStatus.REJECT_STATUS,
            AccountStatus.SUSPENDED_STATUS,
            AccountStatus.DEACTIVATED_STATUS,
            AccountStatus.BANNED_STATUS,
            AccountStatus.CLOSED,
        ],
        default: AccountStatus.PENDING_STATUS,
    },

    shopAddress: {
        location: {
            type: String,
            required: [true, "locality is required."]
        },

        city: {
            type: String,
            required: [true, "city is required."]
        },
        state: {
            type: String,
            required: [true, "state is required."]
        },
        pincode: {
            type: String,
        },

        landmark: {
            type: String,

        },
        mobile: {
            type: String
        }
    },

    /// system generate information 

    shopRating: {
        type: Number,
        min: [0, ""],
        max: [5, ""]
    },

    logo: {
        type: String,

    },
    discription: {
        type: String,
    },
    banner: {
        type: String
    },
    openingHour:{
        type: String,
    }

}, { timestamps: true })

