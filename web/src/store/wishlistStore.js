// Place at: src/store/wishlistStore.js
import { create } from "zustand";

import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
  moveToCartApi,
} from "../api/wishlist.api";

const useWishlistStore = create((set) => ({
  loading: false,

  wishlist: { items: [] },

  /// Get logged-in user's wishlist
  getWishlist: async () => {
    set({ loading: true });

    try {
      const res = await getWishlistApi();

      set({
        wishlist: res.data || { items: [] },
      });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  /// Add product to wishlist
  /// data: { productId, shopId }
  addToWishlist: async (data) => {
    set({ loading: true });

    try {
      const res = await addToWishlistApi(data);

      set({ wishlist: res.data });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  /// Remove single product from wishlist
  removeFromWishlist: async (productId) => {
    set({ loading: true });

    try {
      const res = await removeFromWishlistApi(productId);

      set({ wishlist: res.data });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  /// Clear entire wishlist
  clearWishlist: async () => {
    set({ loading: true });

    try {
      const res = await clearWishlistApi();

      set({ wishlist: { items: [] } });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },

  /// Move a wishlist item into the cart
  moveToCart: async (productId) => {
    set({ loading: true });

    try {
      const res = await moveToCartApi(productId);

      set({ wishlist: res.data });

      return res;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useWishlistStore;
