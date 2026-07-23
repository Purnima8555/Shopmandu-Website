

import { create } from "zustand";
import { getAllPaymentsApi } from "../../../api/payment.api";

const useAdminMangePaymentStore = create((set) => ({
    loading: false,

    payments: [],
    paymentMetadata: null,

    /// Get all payments
    getAllPayments: async (params = {}) => {
        set({ loading: true });

        try {
        const res = await getAllPaymentsApi(params);

        set({
            payments: res.payments?.data || [],
            paymentMetadata: res.payments?.metadata || null,
        });

        return res;
        } finally {
        set({ loading: false });
        }
    },
}));

export default useAdminMangePaymentStore;

