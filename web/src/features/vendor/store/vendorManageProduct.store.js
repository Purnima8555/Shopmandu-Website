
import {create} from "zustand"
import { addProductImagesApi, createProduct, deleteProductImageApi, getAllMyProducts, getProductsSummary, updateProductInfoApi, } from "../../../api/product.api";



const useVendorProductManageStore = create((set) => ({
    ///states
    loading: true,
    productsSummary: null,
    myProducts: [],
    productsMeta: null,
    
    setShop: (shop) => set({ shop }),


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


    // Update product information
    updateProductInfo: async (productId, productData) => {
        set({ loading: true });

        try {
        const res = await updateProductInfoApi(productId, productData);

        set((state) => ({
            myProducts: state.myProducts.map((product) =>
            product._id === res.data._id ? res.data : product
            ),
        }));

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Add product images
    addProductImages: async (productId, formData) => {
        set({ loading: true });

        try {
        const res = await addProductImagesApi(productId, formData);

        set((state) => ({
            myProducts: state.myProducts.map((product) =>
            product._id === res.data._id ? res.data : product
            ),
        }));

        return res;
        } finally {
        set({ loading: false });
        }
    },

    // Delete product image
    deleteProductImage: async (productId, imageUrl) => {
        set({ loading: true });

        try {
        const res = await deleteProductImageApi(productId, imageUrl);

        set((state) => ({
            myProducts: state.myProducts.map((product) =>
            product._id === res.data._id ? res.data : product
            ),
        }));

        return res;
        } finally {
        set({ loading: false });
        }
    },

}))


export default useVendorProductManageStore;

