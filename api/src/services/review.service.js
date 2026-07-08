import mongoose from "mongoose";
import ReviewModel from "../models/Review.model.js";
import ProductModel from "../models/Product.model.js";
import OrderModel from "../models/Order.model.js";
import {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} from "../utils/AppError.js";
import orderStatus from "../constants/orderStatus.js";

// ─── Helper: recalculate and save product rating after any review change ──────
const updateProductRating = async (productId) => {

    const result = await ReviewModel.aggregate([
        {
            $match: {
                productId: new mongoose.Types.ObjectId(productId),
                isVisible: true,
            },
        },
        {
            $group: {
                _id: "$productId",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    const avgRating = result[0]?.avgRating ?? 0;
    const totalReviews = result[0]?.totalReviews ?? 0;

    await ProductModel.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews,
    });
};

// ─── Add a review ─────────────────────────────────────────────────────────────
// Only customers who actually bought and received the product can review it
export const addReviewService = async (
    customerId,
    productId,
    { rating, comment },
    ) => {
    // 1. Check product exists
    const product = await ProductModel.findById(productId);
    if (!product) throw new NotFoundError("Product not found.");

    // 2. Check customer has order this product
    const hasPurchased = await OrderModel.findOne({
        customerId,
        orderStatus: orderStatus.DELIVERED,
        "items.productId": productId,
    });

    if (!hasPurchased) {
        throw new ForbiddenError(
        "You can only review products you have purchased and received.",
        );
    }

  // 3. Check they haven't already reviewed this product
    const existing = await ReviewModel.findOne({ productId, customerId });
    if (existing)
        throw new BadRequestError("You have already reviewed this product.");

    // 4. Create the review
    const review = await ReviewModel.create({
        productId,
        customerId,
        rating,
        comment,
    });

    // 5. Update the product's rating and review count
    await updateProductRating(productId);

    return review;
};

// ─── Edit own review ──────────────────────────────────────────────────────────
export const editReviewService = async (
    customerId,
    reviewId,
    { rating, comment },
    ) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found.");

    if (review.customerId.toString() !== customerId.toString()) {
        throw new ForbiddenError("You can only edit your own reviews.");
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    await updateProductRating(review.productId);

    return review;
};

// ─── Delete own review ────────────────────────────────────────────────────────
export const deleteReviewService = async (customerId, reviewId) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) throw new NotFoundError("Review not found.");

    if (review.customerId.toString() !== customerId.toString()) {
        throw new ForbiddenError("You can only delete your own reviews.");
    }

    const productId = review.productId;
    await review.deleteOne();
    await updateProductRating(productId);

    return { message: "Review deleted." };
};

// ─── Get all reviews for a product (public) ───────────────────────────────────
export const getProductReviewsService = async (
    productId,
    { page = 1, limit = 10 } = {},
    ) => {
    const product = await ProductModel.findById(productId).select(
        "name rating totalReviews",
    );
    if (!product) throw new NotFoundError("Product not found.");

    const skip = (page - 1) * limit;

    const reviews = await ReviewModel.find({ productId, isVisible: true })
        .populate("customerId", "userName") // only show the name, not email/password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return {
        productName: product.name,
        averageRating: product.rating,
        totalReviews: product.totalReviews,
        reviews,
        page: Number(page),
        pages: Math.ceil(product.totalReviews / limit),
    };
};
