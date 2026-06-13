

import couponType from "../constants/couponType.js";
import CouponModel from "../models/coupon.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";

// ─── Create a new coupon (admin only) ────────────────────────────────────────
export const createCouponService = async (adminId, body) => {
    const {
        code, discountType, discountValue,
        minOrderAmount, maxDiscountAmount,
        usageLimit, perUserLimit, expiresAt
    } = body;

    // Percentage coupons should not exceed 100%
    // if (discountType === couponType.PERCENTAGE && discountValue > 100) {
    //     throw new BadRequestError("Percentage discount cannot exceed 100.");
    // }

    // Check if coupon code already exists
    const existing = await CouponModel.findOne({ code: code.toUpperCase() });
    if (existing) {
        throw new BadRequestError("A coupon with this code already exists.");
    }

    const coupon = await CouponModel.create({
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        usageLimit,
        perUserLimit,
        expiresAt,
        createdBy: adminId
    });

    return coupon;
};

// ─── Get all coupons (admin only) ─────────────────────────────────────────────
export const getAllCouponsService = async () => {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return coupons;
};

// ─── Get single coupon by ID (admin only) ─────────────────────────────────────
export const getCouponByIdService = async (couponId) => {
    const coupon = await CouponModel.findById(couponId);
    if (!coupon) throw new NotFoundError("Coupon not found.");
    return coupon;
};

// ─── Update a coupon (admin only) ─────────────────────────────────────────────
export const updateCouponService = async (couponId, body) => {
    const code = body.code?.trim().toUpperCase()
    // Prevent changing the code to one that already exists
    if (code) {
        const existing = await CouponModel.findOne({
            code,
            _id: { $ne: couponId }         // exclude current coupon
        });
        if (existing) throw new BadRequestError("Coupon code already taken.");
        body.code = code
    }

    const coupon = await CouponModel.findByIdAndUpdate(couponId,body,
        {
            // new: true,
            returnDocument: "after",
            runValidators: true
        }
    );
    if (!coupon) throw new NotFoundError("coupon not found");
    return coupon;
};

// ─── Delete a coupon (admin only) ─────────────────────────────────────────────
export const deleteCouponService = async (couponId) => {
    const coupon = await CouponModel.findByIdAndDelete(couponId);
    if (!coupon) throw new NotFoundError("Coupon not found.");
    return { message: "Coupon deleted successfully." };
};

// ─── Validate & apply a coupon (from order service) ────────────────────
// Returns the final discount amount to subtract from the cart total.
export const applyCouponService = async (userId, code, cartTotal) => {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });

    // Check if coupon exists
    if (!coupon) throw new NotFoundError("Invalid coupon code.");

    // Check if coupon active
    if (!coupon.isActive) throw new BadRequestError("This coupon is no longer active.");

    // Check if coupon expired
    if (new Date() > new Date(coupon.expiresAt)) {
        throw new BadRequestError("This coupon has expired.");
    }

    // Expired coupon or not
    if (coupon.usageLimit !== null && coupon.usedCount > coupon.usageLimit) {
        throw new BadRequestError("This coupon has reached its usage limit.");
    }

    // Does the cart meet the minimum order amount?
    if (cartTotal < coupon.minOrderAmount) {
        throw new BadRequestError(
            `Minimum order amount of ${coupon.minOrderAmount} is required for this coupon.`
        );
    }

    // Has this specific user exceeded their per-user limit?
    const userUsage = coupon.usedBy.find(entry => entry.userId.toString() === userId.toString());
    if (userUsage && userUsage.count >= coupon.perUserLimit) {
        throw new BadRequestError("You have already used this coupon the maximum number of times.");
    }

    // ── Calculate the discount amount ──────────────────────────────────────────
    let discountAmount = 0;

    if (coupon.discountType === couponType.PERCENTAGE) {
        discountAmount = (coupon.discountValue / 100) * cartTotal;

        // Apply cap if one is set
        if (coupon.maxDiscountAmount !== null) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
    } else {
        // FIXED discount — but never more than the cart total
        discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    // Round to 2 decimal places to avoid floating-point mess
    discountAmount = parseFloat(discountAmount.toFixed(2));

    return {
        coupon,         // pass this to the order service to save couponId/couponCode
        discountAmount
    };
};

// ─── Mark coupon as used after order is confirmed ─────────────────────────────
// Call this inside your order service after the order is created successfully.
export const markCouponAsUsedService = async (couponId, userId) => {
    const coupon = await CouponModel.findById(couponId);
    if (!coupon) return;    // silently skip if somehow missing

    coupon.usedCount += 1;

    const userUsage = coupon.usedBy.find(
        (entry) => entry.userId.toString() === userId.toString()
    );

    if (userUsage) {
        userUsage.count += 1;       // user used it before, increment
    } else {
        coupon.usedBy.push({ userId, count: 1 });   // first time this user uses it
    }
    await coupon.save();
    return true;
};