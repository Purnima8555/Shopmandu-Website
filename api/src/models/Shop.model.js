import mongoose from "mongoose";
import ShopStatus from "../constants/ShopStatus.js";


const shopSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

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

    ShopStatus: {
        type: String,
        enum: [
            ShopStatus.ACTIVE_STATUS,
            ShopStatus.DEACTIVATED_STATUS,
            ShopStatus.CLOSED_STATUS,

            ShopStatus.PENDING_STATUS,

            ShopStatus.SUSPENDED_STATUS,
            ShopStatus.BANNED_STATUS,
        ],
        default: ShopStatus.PENDING_STATUS,
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

    slugs: {
        type: String,
        unique: true,
        index: true,
        required: true
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
    openingHour: {
        open: {
            type: String,
            trim: true
        },
        close: {
            type: String,
            trim: true
        }
    }

}, { timestamps: true })


const ShopModel = mongoose.model("Shop", shopSchema);
export default ShopModel;

