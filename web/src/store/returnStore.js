import { create } from "zustand";

import {
    createReturnRequestApi,
    getCustomerReturnRequestsApi,
    getVendorReturnRequestsApi,
    approveReturnRequestApi,
    rejectReturnRequestApi,
    refundReturnRequestApi,
    getAllReturnRequestsApi,
} from "../api/return.api";

const useReturnStore = create((set, get) => ({
    loading: false,

    returns: [],
    metadata: null,

    // CUSTOMER
    // create return request
    createReturnRequest: async (data) => {
        try {
            set({ loading: true });

            const res = await createReturnRequestApi(data);

            await get().getCustomerReturnRequests();

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // get
    getCustomerReturnRequests: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await getCustomerReturnRequestsApi(params);

            set({
                returns: res.data.data || [],
                metadata: res.data.metadata,
            });

            return res;
        } finally {
            set({ loading: false });
        }
    },

    // VENDOR
    // get
    getVendorReturnRequests: async () => {
        try {
            set({ loading: true });

            const res = await getVendorReturnRequestsApi();

            set({
                returns: res.data || [],
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

            await get().getVendorReturnRequests();

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

            await get().getVendorReturnRequests();

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

            await get().getVendorReturnRequests();

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

export default useReturnStore;