

import { create } from "zustand";
import { getAllProductsApi, getFlashSaleProductsApi } from "../api/product.api";

const useProductStore = create((set) => ({
  /// state
  products: [],
  bestSellingProducts: [],
  flashSalesProduct: [],
  pagination: null,
  loading: false,

  /// get all products
  getProducts: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await getAllProductsApi(params);
      set({
        products: res.data.data,
        pagination: res.data.pagination,
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
}));

export default useProductStore;