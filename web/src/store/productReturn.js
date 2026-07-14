import { create } from "zustand";
import {
  getVendorRequestsApi,
  approveRequestApi,
  rejectRequestApi,
  refundRequestApi,
} from "../api/return.api";

const useReturnStore = create((set) => ({
  /// State
  requests: [],
  metadata: null,
  loading: false,

  /// Get vendor requests
  getVendorRequests: async (params = {}) => {
    try {
      set({ loading: true });

      const res = await getVendorRequestsApi(params);

      set({
        requests: res.data,
        metadata: res.metadata,
      });

      return res;
    } finally {
      set({ loading: false });
    }
  },

  /// Approve request
  approveRequest: async (requestId) => {
    set({ loading: true });

    try {
      const res = await approveRequestApi(requestId);

      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === res.data._id ? res.data : request
        ),
      }));

      return res;
    } finally {
      set({ loading: false });
    }
  },

  /// Reject request
  rejectRequest: async (requestId) => {
    set({ loading: true });

    try {
      const res = await rejectRequestApi(requestId);

      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === res.data._id ? res.data : request
        ),
      }));

      return res;
    } finally {
      set({ loading: false });
    }
  },

  /// Refund request
  refundRequest: async (requestId) => {
    set({ loading: true });

    try {
      const res = await refundRequestApi(requestId);

      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === res.data._id ? res.data : request
        ),
      }));

      return res;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useReturnStore;