import { create } from "zustand";

import {
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeCartItemApi,
    clearCartApi,
} from "../../../api/cart.api";

const useCartStore = create((set, get) => ({
    loading: false,

    cart: {
        items: [],
        totalPrice: 0,
    },

    // Get Cart
    getCart: async () => {
        try {
        set({ loading: true });

        const res = await getCartApi();

        set({
            cart: res.data,
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Add Item
    addToCart: async (productId, quantity = 1) => {
        try {
        set({ loading: true });

        const res = await addToCartApi(productId, quantity);

        await get().getCart();

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Update Quantity
    updateCartItem: async (productId, quantity) => {
        try {
        set({ loading: true });

        const res = await updateCartItemApi(productId, quantity);

        await get().getCart();

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Remove Item
    removeCartItem: async (productId) => {
        try {
        set({ loading: true });

        const res = await removeCartItemApi(productId);

        await get().getCart();

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Clear Cart
    clearCart: async () => {
        try {
        set({ loading: true });

        const res = await clearCartApi();

        set({
            cart: {
            items: [],
            totalPrice: 0,
            },
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Check if product exists in cart
    isInCart: (productId) => {
        return get().cart.items.some((item) => item.productId?._id === productId);
    },

    // Get quantity of a product
    getCartQuantity: (productId) => {
        const item = get().cart.items.find(
        (item) => item.productId?._id === productId,
        );

        return item ? item.quantity : 0;
    },

    // Total number of products
    cartCount: () => {
        return get().cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },
}));

export default useCartStore;
