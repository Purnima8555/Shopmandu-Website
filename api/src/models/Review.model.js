import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required."],
        index: true,
        },

        customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer ID is required."],
        },

        rating: {
        type: Number,
        required: [true, "Rating is required."],
        min: [1, "Rating must be at least 1."],
        max: [5, "Rating cannot exceed 5."],
        },

        comment: {
        type: String,
        trim: true,
        maxlength: [500, "Comment cannot exceed 500 characters."],
        },

        // Admin or vendor can hide an abusive review
        isVisible: {
        type: Boolean,
        default: true,
        },
    },
    { timestamps: true },
);

// One review per customer per product
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
