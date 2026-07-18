import api from "./axios";

/// Get wishlist
export const getWishlistApi = async () => {
    const res = await api.get("/api/wishlist");
    return res.data;
    // return
};

/// Add product
export const addToWishlistApi = async (productId) => {
    const res = await api.post("/api/wishlist/add", {
        productId,
    });

    return res.data;
};

/// Remove product
export const removeFromWishlistApi = async (productId) => {
    const res = await api.delete(
        `/api/wishlist/remove/${productId}`
    );

    return res.data;
};

/// Clear wishlist
export const clearWishlistApi = async () => {
    const res = await api.delete("/api/wishlist/clear");

    return res.data;
};

/// Move to cart
export const moveWishlistToCartApi = async (productId) => {
    const res = await api.post(
        `/api/wishlist/move-to-cart/${productId}`
    );

    return res.data;
};