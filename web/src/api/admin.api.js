import api from "./axios";

/* =====================================================
USERS
===================================================== */

export const getAllUsersApi = async () => {
    const res = await api.get("/api/users/all");
    return res.data;
};

/* =====================================================
CATEGORIES
===================================================== */

// Create category
export const createCategoryApi = async (data) => {
    const res = await api.post("/api/category", data);
    return res.data;
};

// Get all categories
export const getAllCategoriesApi = async () => {
    const res = await api.get("/api/category");
    return res.data;
};

// Get category by ID
export const getCategoryByIdApi = async (categoryId) => {
    const res = await api.get(`/api/category/${categoryId}`);
    return res.data;
};

// Update category
export const updateCategoryApi = async (categoryId, data) => {
    const res = await api.put(`/api/category/${categoryId}`, data);
    return res.data;
};

// Toggle category status
export const toggleCategoryStatusApi = async (categoryId) => {
    const res = await api.patch(`/api/category/${categoryId}/toggle-status`);
    return res.data;
};

// Delete category
export const deleteCategoryApi = async (categoryId) => {
    const res = await api.delete(`/api/category/${categoryId}`);
    return res.data;
};

/* =====================================================
PAYMENTS
===================================================== */

// Get all payments
export const getAllPaymentsApi = async (params) => {
    const res = await api.get("/api/admin/payments", {
        params,
    });
    return res.data;
};

/* =====================================================
PRODUCTS
===================================================== */

// Get all products
export const getAllProductsApi = async (params) => {
    const res = await api.get("/api/products/public", {
        params,
    });
    return res.data;
};

// Get top products (Dashboard)
export const getTopProductsApi = async (params) => {
    const res = await api.get("/api/products/admintop", {
        params,
    });
    return res.data;
};

// Get product by ID
export const getProductByIdApi = async (productId) => {
    const res = await api.get(`/api/product/${productId}`);
    return res.data;
};
/* =====================================================
ORDERS
===================================================== */

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

// Get admin sales summary
export const getAdminSalesSummaryApi = async (params) => {
    const res = await api.get("/api/order/admin/sales-summary", {
        params,
    });
    return res.data;
};

/* =====================================================
COUPONS
===================================================== */

// Create coupon
export const createCouponApi = async (data) => {
    const res = await api.post("/api/coupon", data);
    return res.data;
};

// Get all coupons
export const getAllCouponsApi = async () => {
    const res = await api.get("/api/coupon");
    return res.data;
};

// Get coupon by ID
export const getCouponByIdApi = async (couponId) => {
    const res = await api.get(`/api/coupon/${couponId}`);
    return res.data;
};

// Update coupon
export const updateCouponApi = async (couponId, data) => {
    const res = await api.put(`/api/coupon/${couponId}`, data);
    return res.data;
};

// Delete coupon
export const deleteCouponApi = async (couponId) => {
    const res = await api.delete(`/api/coupon/${couponId}`);
    return res.data;
};

/* =====================================================
SHOPS
===================================================== */

// Search shops
export const searchShopsApi = async (params) => {
    const res = await api.get("/api/shops/search", {
        params,
    });
    return res.data;
};

// Update shop status
export const updateShopStatusApi = async (shopId, data) => {
    const res = await api.patch(
        `/api/admin/shops/${shopId}/status`,
        data
    );
    return res.data;
};

/* =====================================================
VENDORS
===================================================== */

// Get vendors (filtered, paginated)
export const getVendorsApi = async (params) => {
    const res = await api.get("/api/admin/vendors", {
        params,
    });
    return res.data;
};

// Get all vendors
export const getAllVendorsApi = async () => {
    const res = await api.get("/api/admin/vendors/all");
    return res.data;
};

// Get vendor details
export const getVendorByIdApi = async (vendorId) => {
    const res = await api.get(`/api/admin/vendor/${vendorId}`);
    return res.data;
};

/* =====================================================
VENDOR KYC
===================================================== */

// Get KYC applications
export const getVendorKycListApi = async (params) => {
    const res = await api.get("/api/admin/kyc/status-filter", {
        params,
    });
    return res.data;
};

// Get KYC document/details
export const getVendorKycByIdApi = async (kycId) => {
    const res = await api.get(`/api/admin/kyc/${kycId}`);
    return res.data;
};

// Approve KYC
export const approveVendorKycApi = async (kycId) => {
    const res = await api.put(`/api/admin/kyc/${kycId}/approve`);
    return res.data;
};

// Reject KYC
export const rejectVendorKycApi = async (kycId, data) => {
    const res = await api.put(
        `/api/admin/kyc/${kycId}/reject`,
        data
    );
    return res.data;
};