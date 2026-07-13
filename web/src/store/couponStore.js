import { create } from "zustand";

import {
    createCouponApi,
    getAllCouponsApi,
    getCouponByIdApi,
    updateCouponApi,
    deleteCouponApi,
} from "../api/coupon.api";

const useCouponStore = create((set, get) => ({
    loading: false,

    coupons: [],
    selectedCoupon: null,

    /// Get all coupons
    getAllCoupons: async () => {
        set({ loading: true });

        try {
            const res = await getAllCouponsApi();

            set({
                coupons: res.data || [],
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Get coupon by id
    getCouponById: async (couponId) => {
        set({ loading: true });

        try {
            const res = await getCouponByIdApi(couponId);

            set({
                selectedCoupon: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Create coupon
    createCoupon: async (data) => {
        set({ loading: true });

        try {
            const res = await createCouponApi(data);

            await get().getAllCoupons();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Update coupon
    updateCoupon: async (couponId, data) => {
        set({ loading: true });

        try {
            const res = await updateCouponApi(couponId, data);

            await get().getAllCoupons();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    /// Delete coupon
    deleteCoupon: async (couponId) => {
        set({ loading: true });

        try {
            const res = await deleteCouponApi(couponId);

            await get().getAllCoupons();

            return res;
        } finally {
            set({ loading: false });
        }
    },
    
}));

export default useCouponStore;
