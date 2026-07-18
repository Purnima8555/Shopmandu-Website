import api from "./axios";

/// Get cart
export const getCartApi = async () => {
    const res = await api.get("/api/cart");
    return res.data;
};

/// Add product to cart
export const addToCartApi = async (productId, quantity = 1) => {
    const res = await api.post("/api/cart/add", {
        productId,
        quantity,
    });

    return res.data;
};

/// Update quantity
export const updateCartItemApi = async (productId, quantity) => {
    const res = await api.put(`/api/cart/update/${productId}`, {
        quantity,
    });

    return res.data;
};

/// Remove item
export const removeCartItemApi = async (productId) => {
    const res = await api.delete(`/api/cart/delete/${productId}`);

    return res.data;
};

/// Clear cart
export const clearCartApi = async () => {
    const res = await api.delete("/api/cart/clear");

    return res.data;
};