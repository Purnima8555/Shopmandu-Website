
import api from "./axios";

/// Create coupon
export const createCouponApi = async (data) => {
    const res = await api.post("/api/coupon", data);
    return res.data;
};

/// Get all coupons
export const getAllCouponsApi = async () => {
    const res = await api.get("/api/coupon");
    return res.data;
};

/// Get coupon by id
export const getCouponByIdApi = async (couponId) => {
    const res = await api.get(`/api/coupon/${couponId}`);
    return res.data;
};

/// Update coupon
export const updateCouponApi = async (couponId, data) => {
    const res = await api.put(`/api/coupon/${couponId}`, data);
    return res.data;
};

/// Delete coupon
export const deleteCouponApi = async (couponId) => {
    const res = await api.delete(`/api/coupon/${couponId}`);
    return res.data;
};
