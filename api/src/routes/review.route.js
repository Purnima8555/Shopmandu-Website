import { Router } from "express";

import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";

import Roles from "../constants/userRoles.js";

import { addReview, editReview, deleteReview, getProductReviews, } from "../controllers/review.controller.js";

import {
    addReviewSchema,
    editReviewSchema,
} from "../libs/schema/review.schema.js";

const router = Router();

// public
// Get all reviews for a product
router.get(
    "/:productId",
    getProductReviews
);


// customer
// Add review
router.post(
    "/:productId",
    auth,
    roleBasedAuth(Roles.USER_ROLE),
    schemaValidator(addReviewSchema),
    addReview
);

// Edit own review
router.put(
    "/:reviewId",
    auth,
    roleBasedAuth(Roles.USER_ROLE),
    schemaValidator(editReviewSchema),
    editReview
);

// Delete own review
router.delete(
    "/:reviewId",
    auth,
    roleBasedAuth(Roles.USER_ROLE),
    deleteReview
);

export default router;