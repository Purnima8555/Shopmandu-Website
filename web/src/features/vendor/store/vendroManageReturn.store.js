

import { create } from "zustand";

import { getVendorReturnRequestsApi, approveReturnRequestApi, rejectReturnRequestApi, refundReturnRequestApi, getAllReturnRequestsApi} from "../../../api/return.api";
const useVendorReturnManage = create((set, get) => ({
    loading: false,
    returns: [],
    metadata: null,
    selectedReturn: null,
    setSelectedReturn: (request) =>
        set({
            selectedReturn: request,
        }),

    // VENDOR
    // get
    getVendorReturnRequests: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getVendorReturnRequestsApi(params);

            set({
                returns: res.data.data || [],
                metadata: res.data.metadata,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // approve
    approveReturnRequest: async (id) => {
        try {
            set({ loading: true });

            const res = await approveReturnRequestApi(id);

            await get().getVendorReturnRequests({
                page: get().metadata?.currentPage || 1,
                limit: get().metadata?.limit || 10,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // reject
    rejectReturnRequest: async (id) => {
        try {
            set({ loading: true });

            const res = await rejectReturnRequestApi(id);

            await get().getVendorReturnRequests({
                page: get().metadata?.currentPage || 1,
                limit: get().metadata?.limit || 10,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // refund allow
    refundReturnRequest: async (id) => {
        try {
            set({ loading: true });

            const res = await refundReturnRequestApi(id);

            await get().getVendorReturnRequests({
                page: get().metadata?.currentPage || 1,
                limit: get().metadata?.limit || 10,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // ADMIN
    // get
    getAllReturnRequests: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getAllReturnRequestsApi(params);

            set({
                returns: res.data.data || [],
                metadata: res.data.metadata,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useVendorReturnManage;
