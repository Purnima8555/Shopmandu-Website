
import { create } from "zustand";
import {getAllProductCategories, getAllProductsApi, getFlashSaleProductsApi, getProductByIdApi, getProductBySlug, getTopProductsApi, } from "../api/product.api";

const useProductStore = create((set) => ({
  /// state
  products: [],
  productPageProducts: [], // separate state for product listing page
  bestSellingProducts: [],
  flashSalesProduct: [],
  pagination: null,
  productPagePagination: null, // separate pagination for product listing page
  loading: true,
  categories: [],
  productDetail: [],
  topProducts: [],
  selectedProduct: null,

  /// get all products
  getProducts: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await getAllProductsApi(params);

      // console.log(res.data)
      set({
        products: res?.data || [],
        pagination: res?.metadata|| {},
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  /// get products specifically for the product listing page
  getProductsForPage: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await getAllProductsApi(params);
      set({
        productPageProducts: res?.data,
        productPagePagination: res?.metadata,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  //// get flash sale products
  flashShale: async (params = {}) => {
    try {
      const res = await getFlashSaleProductsApi(params);

      set({
        flashSalesProduct: res.data.data,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  /// best saling product in this weeks
  getBestSellingProducts: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await getAllProductsApi(params);
      set({
        bestSellingProducts: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  /// get all categories
  getAllCategories: async (params = {}) => {
    try {
      const category = await getAllProductCategories(params);
      set({
        categories: category,
        loading: false,
      });

      return category;
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      set({ loading: true });

      const res = await getProductByIdApi(productId);

      set({
        selectedProduct: res.data,
      });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  // Get top products
  getTopProducts: async (params = {}) => {
    try {
      set({ loading: true });

      const res = await getTopProductsApi(params);

      set({
        topProducts: res.data || [],
      });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },


  getProductDetail: async (params) => {

    try {

      const res = await getProductBySlug(params)
      set({
        productDetail: res.data
      })
      return res.data

    } catch (error) {
      set({ loading: false })
      console.log(error)
    }

  },

 
}));

export default useProductStore;