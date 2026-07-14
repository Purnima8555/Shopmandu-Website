import * as reviewService from "../services/review.service.js";

// POST /reviews/:productId  — add a review
export const addReview = async (req, res, next) => {
    try {
        const review = await reviewService.addReviewService(
        req.user._id,
        req.params.productId,
        req.body,
        );
        res
        .status(201)
        .json({ success: true, message: "Review added.", data: review });
    } catch (error) {
        next(error);
    }
};

// PUT /reviews/:reviewId  — edit own review
export const editReview = async (req, res, next) => {
    try {
        const review = await reviewService.editReviewService(
        req.user._id,
        req.params.reviewId,
        req.body,
        );
        res
        .status(200)
        .json({ success: true, message: "Review updated.", data: review });
    } catch (error) {
        next(error);
    }
};

// DELETE /reviews/:reviewId  — delete own review
export const deleteReview = async (req, res, next) => {
    try {
        const result = await reviewService.deleteReviewService(
        req.user._id,
        req.params.reviewId,
        );
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// GET /reviews/:productId  — get all reviews for a product (public)
export const getProductReviews = async (req, res, next) => {
    try {
        const data = await reviewService.getProductReviewsService(
        req.params.productId,
        req.query,
        );
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
