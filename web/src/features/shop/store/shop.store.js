



import { create } from "zustand"
import { changeMyShopStatus, getKycStatus, getMyShop, updateShopInfo, uploadShopBanner, uploadShopLogo, searchShopsApi, createShop, updateShopStatusApi, getShopBySlugApi, getProductsByShopApi, } from "../../../api/shop"


const useShopStore = create((set) => ({
    ///states
    shop: [],
    shops: [],
    loading: true,
    kycStatus: null,

    currentShop: null,
    currentShopLoading: false,
    shopProducts: [],
    shopProductsMeta: null,
    shopProductsLoading: false,

    setShop: (shop) => set({ shop }),
    //// create shop
    createShop: async (shopData) => {

        try {
            const res = await createShop(shopData);
            set({
                shop: res?.data,
                loading: false
            })

            return res
        } finally {
            set({ loading: false })
        }

    },

    /// get my shop 
    getMyshop: async () => {

        try {

            const shop = await getMyShop();
            // console.log(shop.data)
            set({
                shop: shop?.data,
                loading: false
            })
            return shop?.data

        } finally {
            set({ loading: false })
        }

    },

    /// get shop kyc status
    getMyKycStatus: async () => {


        try {
            // console.log("calling Api")
            const kyc = await getKycStatus();
            // console.log(kyc)
            set({
                kycStatus: kyc.data.kycStatus,
                loading: false
            })
            return kyc

        } finally {
            set({ loading: false })
        }
    },

    updateShopLogo: async (formData) => {
        try {

            const shop = await uploadShopLogo(formData);
            // console.log(shop.data)
            set({
                shop: shop?.data,
                loading: false
            })
            return shop?.data


        } finally {
            set({ loading: false })
        }
    },

    updateShopBanner: async (formData) => {
        try {

            const shop = await uploadShopBanner(formData);
            // console.log(shop.data)
            set({
                shop: shop?.data,
                loading: false
            })
            return shop?.data

        } finally {
            set({ loading: false })
        }
    },
    updateShopInfo: async (data) => {
        try {

            const shop = await updateShopInfo(data);
            // console.log(shop.data)
            set({
                shop: shop?.data,
                loading: false
            })
            return shop?.data
        } finally {
            set({ loading: false })
        }
    },
    updateVendorShopStatus: async (statusPayload) => {
        try {
            set({ loading: true });
            const res = await changeMyShopStatus(statusPayload);
            set((state) => ({
                shop: {
                    ...state.shop,
                    ShopStatus: res?.data?.ShopStatus || res?.data?.status || statusPayload.status
                },
                loading: false,
            }));
            return res?.data;
        } finally {

            set({ loading: false });
        }
    },
    // Get all shops
    getAllShops: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await searchShopsApi(params);

            set({
                shops: res.data || [],
                shopMetadata: res.metadata || null,
            });

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    // Update shop status
    updateShopStatus: async (shopId, status) => {
        try {
            set({ loading: true });

            const res = await updateShopStatusApi(shopId, {
                status,
            });

            // Refresh shop list
            await useShopStore.getState().getAllShops();

            return res;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ loading: false });
        }
    },

    //  Public shop details page 
    // Get a shop by its public slug
    getShopBySlug: async (slug) => {
        set({ currentShopLoading: true, currentShop: null });
        try {
            const res = await getShopBySlugApi(slug);
            set({ currentShop: res?.data ?? null });
            return res?.data;
        } catch (error) {
            throw error.response?.data || error;
        } finally {
            set({ currentShopLoading: false });
        }
    },
    // Get products belonging to a shop (by shop _id)
    getShopProducts: async (shopId, params = {}) => {
        // console.log(params)
        set({ shopProductsLoading: true });
        try {
            set({ loading: true });
            const res = await getProductsByShopApi(shopId, params);

            // console.log(res.data)
            set({
                shopProducts: res?.data || [],
                shopProductsMeta: res?.metadata || {},
                loading: false,
                shopProductsLoading: false,
            });

            return res.data;
        } catch (error) {
            set({ loading: false, shopProductsLoading: false });
            console.log(error);
        }
    },

    clearCurrentShop: () => set({ currentShop: null, shopProducts: [], shopProductsMeta: null }),
}))
export default useShopStore;