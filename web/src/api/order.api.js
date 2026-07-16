

import api from "./axios";

/// place a new order from the cart
export const placeOrderApi = async (orderData) => {
    const res = await api.post("/api/order/place", orderData);
    return res.data;
};

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

/// vendor orders.
export const getVendorOrdersApi = async (params) => {
    const res = await api.get("/api/order/vendor/orders", {
        params,
    });

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
    
// Update order item status
export const updateOrderItemStatusApi = async (data) => {
    const res = await api.patch("/api/order/vendor/item/status", data);

    return res.data;
};

// Download vendor invoice
export const getVendorInvoiceApi = async (orderItemId) => {
    const res = await api.get(`/api/order/invoice/vendor/${orderItemId}`, {
        responseType: "blob", // for PDF/file download
    });

    return res.data;
};

// Download Customer Invoice
export const getCustomerInvoiceApi = async (orderId) => {
    const res = await api.get(
        `/api/order/invoice/customer/${orderId}`,
        {responseType: "blob",}
    );

    return res.data;
};

// Cancel customer order
export const cancelCustomerOrderApi = async (orderId) => {
    const res = await api.patch(`/api/order/${orderId}/cancel`);

    return res.data;
};
