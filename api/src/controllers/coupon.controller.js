import * as couponService from "../services/coupon.service.js";

// POST /coupons — create
export const createCoupon = async (req, res, next) => {
    try {
        const coupon = await couponService.createCouponService(req.user._id, req.body);
        res.status(201).json({ success: true, message: "Coupon created.", data: coupon });
    } catch (error) {
        next(error);
    }
};

// GET /coupons — list all
export const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await couponService.getAllCouponsService();
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        next(error);
    }
};

// GET /coupons/:id — single coupon
export const getCouponById = async (req, res, next) => {
    try {
        const coupon = await couponService.getCouponByIdService(req.params.id);
        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        next(error);
    }
};

// PUT /coupons/:id — update
export const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await couponService.updateCouponService(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Coupon updated.", data: coupon });
    } catch (error) {
        next(error);
    }
};

// DELETE /coupons/:id — delete
export const deleteCoupon = async (req, res, next) => {
    try {
        const result = await couponService.deleteCouponService(req.params.id);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

// POST /coupons/apply — validate a coupon against a cart total (used by the frontend)
export const applyCoupon = async (req, res, next) => {
    try {
        const { code, cartTotal } = req.body;
        const result = await couponService.applyCouponService(req.user._id, code, cartTotal);
        res.status(200).json({
            success: true,
            message: "Coupon applied.",
            discountAmount: result.discountAmount,
            couponId: result.coupon._id,
            couponCode: result.coupon.code
        });
    } catch (error) {
        next(error);
    }
};