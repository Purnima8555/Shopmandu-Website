import mongoose from "mongoose";
import couponType from "../constants/couponType.js";

const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: [true, "Coupon code is required."],
        unique: true,
        uppercase: true,    
        trim: true,
        index: true
    },

    discountType: {
        type: String,
        enum: [couponType.PERCENTAGE, couponType.FIXED],
        required: [true, "Discount type is required."]
    },

    // If PERCENTAGE value is 0–100. If FIXED value is flat amount (e.g. 200)
    discountValue: {
        type: Number,
        required: [true, "Discount value is required."],
        min: [0, "Discount value cannot be negative."]
    },

    // Minimum cart total required to use this coupon
    minOrderAmount: {
        type: Number,
        default: 0,
        min: [0, "Minimum order amount cannot be negative."]
    },

    // Cap on discount — useful for percentage coupons (e.g. max Rs. 500 off)
    maxDiscountAmount: {
        type: Number,
        default: null   // null means no cap
    },

    // How many times this coupon can be used in total (null = unlimited)
    usageLimit: {
        type: Number,
        default: null
    },

    // How many times it has been used so far
    usedCount: {
        type: Number,
        default: 0
    },

    // How many times a single user can use this coupon
    perUserLimit: {
        type: Number,
        default: 1
    },

    // Which users have used it and how many times
    usedBy: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            count: {
                type: Number,
                default: 1
            }
        }
    ],

    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: [true, "Expiry date is required."]
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const CouponModel = mongoose.model("Coupon", couponSchema);

export default CouponModel;