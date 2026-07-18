import api from "./axios";

/// Get all payments
export const getAllPaymentsApi = async (params = {}) => {
    const res = await api.get("/api/admin/payments", {
        params,
    });

    return res.data;
};


//// pay order.

export const payOrderApi = async (payload) => {
  const res = await api.post("/api/order/pay", payload);
  return res.data;
};
