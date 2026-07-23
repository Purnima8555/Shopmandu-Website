

import { create } from "zustand";

import {
    createReturnRequestApi,
    getCustomerReturnRequestsApi,
} from "../../../api/return.api";

const useReturnStore = create((set, get) => ({
    loading: false,

    returns: [],
    metadata: null,

    selectedReturn: null,

    setSelectedReturn: (request) =>
        set({
            selectedReturn: request,
        }),

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


}));

export default useReturnStore;
