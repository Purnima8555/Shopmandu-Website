import api from "./axios";

/// get logged-in user's wishlist
export const getWishlistApi = async () => {
  const res = await api.get("/api/wishlist");
  return res.data;
};

/// add product to wishlist
export const addToWishlistApi = async (data) => {
  // data: { productId, shopId }
  const res = await api.post("/api/wishlist/add", data);
  return res.data;
};

/// remove product from wishlist
export const removeFromWishlistApi = async (productId) => {
  const res = await api.delete(`/api/wishlist/remove/${productId}`);
  return res.data;
};

/// clear entire wishlist
export const clearWishlistApi = async () => {
  const res = await api.delete("/api/wishlist/clear");
  return res.data;
};

/// move item from wishlist to cart
export const moveToCartApi = async (productId) => {
  const res = await api.post(`/api/wishlist/move-to-cart/${productId}`);
  return res.data;
};