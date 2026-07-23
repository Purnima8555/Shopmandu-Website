

import { create } from "zustand";
import {
    resubmitVendorKycApi,
    submitVendorKycApi,
    getVendorKycStatusApi,
    getVendorKycApi,
} from "../../../api/vendor";

const useVendorStore = create((set) => ({
    loading: false,



    // Vendor Self KYC
    vendorKyc: null,
    vendorKycStatus: null,



    getVendorKyc: async () => {
  try {
    set({ loading: true });

    const res = await getVendorKycApi();

    set({
      vendorKyc: res.data || res,
    });

    return res;
  } catch (error) {
    throw error.response?.data || error;
  } finally {
    set({ loading: false });
  }
},

getVendorKycStatus: async () => {
  try {
    set({ loading: true });

    const res = await getVendorKycStatusApi();

    set({
      vendorKycStatus: res,
    });

    return res;
  } catch (error) {
    throw error.response?.data || error;
  } finally {
    set({ loading: false });
  }
},

submitVendorKyc: async (formData) => {
  try {
    set({ loading: true });

    const res = await submitVendorKycApi(formData);

    set({
      vendorKyc: res.data || res,
    });

    return res;

  } finally {
    set({ loading: false });
  }
},

resubmitVendorKyc: async (formData) => {
  try {
    set({ loading: true });

    const res = await resubmitVendorKycApi(formData);

    set({
      vendorKyc: res.data || res,
    });

    return res;
  } finally {
    set({ loading: false });
  }
},

}));

export default useVendorStore;

