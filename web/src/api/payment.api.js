import api from "./axios";

/// Get all payments
export const getAllPaymentsApi = async (params = {}) => {
    const res = await api.get("/api/admin/payments", {
        params,
    });

    return res.data;
};
