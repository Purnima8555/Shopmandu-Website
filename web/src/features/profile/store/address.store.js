

import { create } from "zustand";

import {
    getAddressesApi,
    getAddressByIdApi,
    addAddressApi,
    updateAddressApi,
    deleteAddressApi,
} from "../../../api/address.api";

const useAddressStore = create((set, get) => ({
    loading: false,

    addresses: [],
    selectedAddress: null,

    // Get all addresses
    getAddresses: async () => {
        try {
            set({ loading: true });

            const res = await getAddressesApi();

            set({
                addresses: res.data || [],
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Get address by ID
    getAddressById: async (addressId) => {
        try {
            set({ loading: true });

            const res = await getAddressByIdApi(addressId);

            set({
                selectedAddress: res.data || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Add address
    addAddress: async (data) => {
        try {
            set({ loading: true });

            const res = await addAddressApi(data);

            await get().getAddresses();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update address
    updateAddress: async (addressId, data) => {
        try {
            set({ loading: true });

            const res = await updateAddressApi(addressId, data);

            await get().getAddresses();

            return res;
        } finally {
        set({ loading: false });
        }
    },

    // Delete address
    deleteAddress: async (addressId) => {
        try {
            set({ loading: true });

            const res = await deleteAddressApi(addressId);

            await get().getAddresses();

            return res;
        } finally {
        set({ loading: false });
        }
    },
}));

export default useAddressStore;
