import { create } from "zustand";

import {
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeCartItemApi,
    clearCartApi,
} from "../api/cart.api";

const useCartStore = create((set, get) => ({
    loading: false,

    cart: { items: [], totalPrice: 0 },

    /// Get logged-in user's cart
    getCart: async () => {
        set({ loading: true });

        try {
            const res = await getCartApi();

            set({
                cart: res.data || { items: [], totalPrice: 0 },
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    /// Add item to cart
    /// data: { productId, quantity, color?, size? }
    addToCart: async (data) => {
        set({ loading: true });

        try {
            const res = await addToCartApi(data);

            set({ cart: res.data });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    /// Update item quantity — pass color/size if the product has variants
    /// so the backend updates the right line
    updateCartItem: async (productId, quantity, color = null, size = null) => {
        set({ loading: true });

        try {
            const res = await updateCartItemApi(productId, quantity, color, size);

            set({ cart: res.data });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    /// Remove single item from cart
    removeCartItem: async (productId, color = null, size = null) => {
        set({ loading: true });

        try {
            const res = await removeCartItemApi(productId, color, size);

            set({ cart: res.data });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    /// Clear entire cart
    clearCart: async () => {
        set({ loading: true });

        try {
            const res = await clearCartApi();

            set({ cart: { items: [], totalPrice: 0 } });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useCartStore;
