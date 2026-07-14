import { create } from "zustand";

import {
    getAllOrdersApi,
    getOrderByIdApi,
    updateOrderStatusApi,
    getAdminSalesSummaryApi,
    getAdminSalesTrendApi,
    getCustomerOrderHistoryApi,
    getCustomerOrderDetailApi,
    getVendorSalesSummaryApi,
    getVendorSalesTrendApi,
} from "../api/order.api";

const useOrderStore = create((set, get) => ({
    loading: false,

    orders: [],
    orderMetadata: null,

    selectedOrder: null,

    salesSummary: null,
    salesTrend: null,

    vendorSalesSummary: null,
    vendorSalesTrend: null,

  // Get all orders
    getAllOrders: async (params = {}) => {
        try {
        set({ loading: true });

        const res = await getAllOrdersApi(params);

        set({
            orders: res.data || [],
            orderMetadata: res.metadata || null,
        });

        return res;
        } catch (error) {
        throw error.response?.data || error;
        } finally {
        set({ loading: false });
        }
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        try {
        set({ loading: true });

        const res = await getOrderByIdApi(orderId);

        set({
            selectedOrder: {
            ...res.data.order,

            items: res.data.orderItems.flatMap((item) =>
                item.products.map((product) => ({
                productName: product.productId?.productName,
                productImage: product.productId?.images?.[0],
                quantity: product.quantity,
                price: product.price,
                total: product.quantity * product.price,
                variant: product.variant,
                })),
            ),
            },
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Update Order Status
    updateOrderStatus: async (orderId, status) => {
        try {
        set({ loading: true });

        const res = await updateOrderStatusApi({
            orderId,
            status,
        });

        await get().getAllOrders();

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // admin Sales Summary
    getAdminSalesSummary: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAdminSalesSummaryApi(params);

            set({
                salesSummary: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // Admin Sales Trend
    getAdminSalesTrend: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAdminSalesTrendApi(params);

            set({
                salesTrend: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // customer history
    getCustomerOrderHistory: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getCustomerOrderHistoryApi(params);

            set({
            orders: res.orders?.data || [],
            metadata: res.orders?.metadata || null,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // Customer Order Detail
    getCustomerOrderDetail: async (orderId) => {
        try {
            set({ loading: true });

            const res = await getCustomerOrderDetailApi(orderId);

            set({
                customerSelectedOrder: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // Vendor Sales Summary
getVendorSalesSummary: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getVendorSalesSummaryApi(params);

            set({
                vendorSalesSummary: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // Vendor Sales Trend
    getVendorSalesTrend: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getVendorSalesTrendApi(params);

            set({
                vendorSalesTrend: res.data,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },
    
}));

export default useOrderStore;
