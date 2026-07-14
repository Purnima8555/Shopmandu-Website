

import api from "./axios";


// Get all orders
export const getAllOrdersApi = async (params) => {
    const res = await api.get("/api/order/admin/orders", {
        params,
    });

    return res.data;
};

// Get order details
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


// Get vendor sales summary
export const getVendorSalesSummaryApi = async (params) => {
    const res = await api.get("/api/order/vendor/sales-summary", {
        params,
    });

    return res.data;
};

/// vendor oorders.

export const getVendorOrdersApi = async (params) => {
    const res = await api.get("/api/order/vendor/orders", {
        params,
    });

    return res.data;
};

// Get vendor sales trend
export const getVendorSalesTrendApi = async (params) => {
    const res = await api.get("/api/order/vendor/sales-trend", {
        params,
    });

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



