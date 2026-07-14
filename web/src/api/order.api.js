

import api from "./axios";


// Get all orders
export const getAllOrdersApi = async (params) => {
    const res = await api.get("/api/order/admin/orders", {
        params,
    });

    return res.data;
};

// Get admin order details
export const getOrderByIdApi = async (orderId) => {
    const res = await api.get(`/api/order/admin/${orderId}`);

    return res.data;
};

// Update order status
export const updateOrderStatusApi = async (data) => {
    const res = await api.patch("/api/order/admin/status", data);

    return res.data;
};

// Sales summary
export const getAdminSalesSummaryApi = async (params) => {
    const res = await api.get("/api/order/admin/sales-summary", {
        params,
    });

    return res.data;
};

// Sales Trend
export const getAdminSalesTrendApi = async (params) => {
    const res = await api.get("/api/order/admin/sales-trend", {
        params,
    });

    return res.data;
};

// order history
export const getCustomerOrderHistoryApi = async (params = {}) => {
    const res = await api.get("/api/order/history", {
        params,
    });

    return res.data;
};

// Customer order detail
export const getCustomerOrderDetailApi = async (orderId) => {
    const res = await api.get(`/api/order/detail/${orderId}`);

    return res.data;
};

/// Vendor Sales Summary
export const getVendorSalesSummaryApi = async (params = {}) => {
    const res = await api.get(
        "/api/order/vendor/sales-summary",
        {
            params,
        }
    );

    return res.data;
};

/// Vendor Sales Trend
export const getVendorSalesTrendApi = async (params = {}) => {
    const res = await api.get(
        "/api/order/vendor/sales-trend",
        {
            params,
        }
    );

    return res.data;
};
