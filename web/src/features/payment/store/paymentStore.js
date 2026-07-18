// features/payment/store/usePaymentStore.js

import { create } from "zustand";
import { payOrderApi } from "../../../api/payment.api";

export const usePaymentStore = create((set) => ({
  loading: false,

  payOrder: async (payload) => {
    set({ loading: true });

    try {
      const payment = await payOrderApi(payload);

      return payment;
    } finally {
      set({ loading: false });
    }
  },
}));