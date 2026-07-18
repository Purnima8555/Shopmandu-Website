import { create } from "zustand";
import { placeOrderApi } from "../../../api/order.api";

export const useUserOrderStore = create((set) => ({
    loading: false,

    // Order
    order: null,

    // Buy Now Product
    buyProduct: null,

    // Set Buy Now Product
    setBuyProduct: (product) =>
        set({
            buyProduct: product,
        }),

    // Clear Buy Now Product
    clearBuyProduct: () =>
        set({
            buyProduct: null,
        }),

    // Place Order
    placeOrder: async (orderData) => {
        set({ loading: true });

        try {
            const data = await placeOrderApi(orderData);

            set({
                order: data?.masterOrder,
                buyProduct: null, // Clear Buy Now product after successful order
            });

            return data?.masterOrder;
        } finally {
            set({
                loading: false,
            });
        }
    },

    // Clear Order
    clearOrder: () =>
        set({
            order: null,
        }),
}));