import api from "./axios";

/// Base path "/api/cart", verified against cart.route.js.

/// get logged-in user's cart
export const getCartApi = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

/// add item to cart
export const addToCartApi = async (data) => {
  // data: { productId, quantity, color?, size? }
  const res = await api.post("/api/cart/add", data);
  return res.data;
};

/// update item quantity
/// color/size are only needed when the same product appears in the cart
/// more than once with different variants — they tell the backend which
/// line to update.
export const updateCartItemApi = async (productId, quantity, color = null, size = null) => {
  const res = await api.put(`/api/cart/update/${productId}`, { quantity, color, size });
  return res.data;
};

/// remove single item from cart
/// DELETE requests can carry a body via axios's `data` config key.
export const removeCartItemApi = async (productId, color = null, size = null) => {
  const res = await api.delete(`/api/cart/delete/${productId}`, { data: { color, size } });
  return res.data;
};

/// clear entire cart
export const clearCartApi = async () => {
  const res = await api.delete("/api/cart/clear");
  return res.data;
};
