import { create } from "zustand";
import { getVendorsApi, getAllVendorsApi, getVendorByIdApi, getVendorKycListApi, getVendorKycByIdApi, approveVendorKycApi,
    rejectVendorKycApi,} from "../api/vendor";
    
const useVendorStore = create((set, get) => ({
    loading: false,

    // Vendors
    vendors: [],
    vendorMetadata: null,
    selectedVendor: null,

    // KYC
    kycList: [],
    kycMetadata: null,
    kycDetail: null,

    getVendors: async (params = {}) => {
            try {
                set({ loading: true });
    
                const res = await getVendorsApi(params);
    
                set({
                    vendors: res.data?.data || res.data || [],
                    vendorMetadata: res.data?.metadata || res.metadata || null,
                });
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
        
    getAllVendors: async () => {
        try {
                set({ loading: true });

                const res = await getAllVendorsApi();
    
                set({
                    vendors: res.vendors || res.data || [],
                });
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
        
        getVendorById: async (vendorId) => {
            try {
                set({ loading: true });

                const res = await getVendorByIdApi(vendorId);

                const { user, vendorKyc } = res.data;

                if (vendorKyc?._id) {
                    const kycRes = await getVendorKycByIdApi(vendorKyc._id);

                    set({
                        kycDetail: kycRes.data || kycRes,
                    });
                }

                set({
                    selectedVendor: {
                        ...vendorKyc,

                        email: user.email,
                        businessEmail: user.email,

                        mobile: user.mobile,
                        businessMobile: user.mobile,

                        createdAt: user.createdAt,
                        updatedAt: vendorKyc?.updatedAt,

                        isVerify: user.isVerify,
                        roles: user.roles,
                    },
                });

                return res;
            } finally {
                set({ loading: false });
            }
        },
        
        getVendorKycList: async (params = {}) => {
            try {
                set({ loading: true });
    
                const res = await getVendorKycListApi(params);
    
                set({
                    kycList: res.data?.data || res.data || [],
                    kycMetadata: res.data?.metadata || res.metadata || null,
                });
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
        
        getVendorKycById: async (kycId) => {
            try {
                set({ loading: true });
    
                const res = await getVendorKycByIdApi(kycId);
    
                set({
                    kycDetail: res.data || res,
                });
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
        
        approveVendorKyc: async (kycId) => {
            try {
                set({ loading: true });
    
                const res = await approveVendorKycApi(kycId);
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
        
        rejectVendorKyc: async (kycId, data) => {
            try {
                set({ loading: true });
    
                const res = await rejectVendorKycApi(kycId, data);
    
                return res;
            } catch (error) {
                throw error.response?.data || error;
            } finally {
                set({ loading: false });
            }
        },
    
    }));
    
    export default useVendorStore;
