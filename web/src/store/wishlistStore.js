import { create } from "zustand";

import {
    getWishlistApi,
    addToWishlistApi,
    removeFromWishlistApi,
    clearWishlistApi,
    moveWishlistToCartApi,
} from "../api/wishlist.api";

const useWishlistStore = create((set, get) => ({
    loading: false,

    wishlist: [],

    getWishlist: async () => {
        try {
            set({ loading: true });

            const res = await getWishlistApi();

            set({
                wishlist: res.data?.items || [],
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    addToWishlist: async (productId) => {
    try {
        set({ loading: true });

        const res = await addToWishlistApi(productId);

        await get().getWishlist();

        return res;
    } finally {
        set({ loading: false });
    }
},

    removeFromWishlist: async (productId) => {
        try {
            set({ loading: true });

            const res = await removeFromWishlistApi(productId);

            await get().getWishlist();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    clearWishlist: async () => {
        try {
            set({ loading: true });

            const res = await clearWishlistApi();

            set({
                wishlist: [],
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    moveWishlistToCart: async (productId) => {
        try {
            set({ loading: true });

            const res = await moveWishlistToCartApi(productId);

            await get().getWishlist();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    isInWishlist: (productId) => {
        return get().wishlist.some(
            (item) => item.productId?._id === productId
        );
    },
}));

export default useWishlistStore;