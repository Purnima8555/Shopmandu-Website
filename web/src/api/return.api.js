
import api from "./axios";

/// Customer - Create return request
export const createReturnRequestApi = async (formData) => {
    const res = await api.post(
        "/api/return",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

/// Customer - Get my return requests
export const getCustomerReturnRequestsApi = async (params = {}) => {
    const res = await api.get(
        "/api/return/customer",
        { params }
    );

    return res.data;
};

/// Vendor - Get return requests
export const getVendorReturnRequestsApi = async (params = {}) => {
    const res = await api.get(
        "/api/return/vendor",
        {
            params,
        }
    );

    return res.data;
};

/// Vendor - Approve
export const approveReturnRequestApi = async (id) => {
    const res = await api.patch(
        `/api/return/${id}/approve`
    );

    return res.data;
};

/// Vendor - Reject
export const rejectReturnRequestApi = async (id) => {
    const res = await api.patch(
        `/api/return/${id}/reject`
    );

    return res.data;
};

/// Vendor - Refund
export const refundReturnRequestApi = async (id) => {
    const res = await api.patch(
        `/api/return/${id}/refund`
    );

    return res.data;
};

/// Admin
export const getAllReturnRequestsApi = async (params = {}) => {
    const res = await api.get(
        "/api/return/admin",
        { params }
    );

    return res.data;
};
