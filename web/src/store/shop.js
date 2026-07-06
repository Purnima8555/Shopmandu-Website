

import { create } from "zustand"
import { changeMyShopStatus, getKycStatus, getMyShop, updateShopInfo, uploadShopBanner, uploadShopLogo } from "../api/shop"
import { createProduct, getAllMyProducts, getProductsSummary } from "../api/product.api";


const useShopStore = create((set) => ({

    ///states
    shop: [],
    loading: true,
    kycStatus: null,
    productsSummary: null,
    myProducts: [],
    productsMeta: null,
    setShop: (shop) => set({ shop }),

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

    /// get product summary

    getProductsSummary: async () => {
        try {

            const summ = await getProductsSummary()
            set({
                productsSummary: summ?.summary,
                loading: false
            })

        } finally {
            set({ loading: false })
        }
    },

    /// get all my products
    getAllMyProducts: async (params = {}) => {
        set({ loading: true });
        try {
            const response = await getAllMyProducts(params);
            set({
                myProducts: response?.data ?? [],
                productsMeta: response?.metadata ?? {},
                loading: false,
            });
        } finally  {
            set({ loading: false });
        }
    },

    /// create product

    createNewProduct: async (formData) => {
        set({ loading: true });

        try {
            const product = await createProduct(formData);

            // console.log("Product from Store: ",product)
            set((state) => ({
                myProducts: [product?.data, ...state.myProducts],
                loading: false,
            }));

            return product;
        } finally {
            set({ loading: false });
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

    updateShopStatus: async (statusPayload) => {
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
        } finally{
            
            set({ loading: false });
        }
    }

}))


export default useShopStore;
