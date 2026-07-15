


import * as wishlistService from "../services/wishlist.service.js";
import * as cartService from "../services/cart.service.js";

// GET /wishlist — get the logged-in user's wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlistService(req.user._id);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// POST /wishlist/add — add a product to the wishlist
// Body: { productId, shopId }
export const addToWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.addToWishlistService(req.user._id, req.body);
    res.status(200).json({ success: true, message: "Product added to wishlist.", data: wishlist });
  } catch (error) {
    next(error);
  }
};

// DELETE /wishlist/remove/:productId — remove one item
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.removeFromWishlistService(
      req.user._id,
      req.params.productId,
    );
    res.status(200).json({ success: true, message: "Product removed from wishlist.", data: wishlist });
  } catch (error) {
    next(error);
  }
};

// DELETE /wishlist/clear — remove all items
export const clearWishlist = async (req, res, next) => {
  try {
    const result = await wishlistService.clearWishlistService(req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// POST /wishlist/move-to-cart/:productId
// Removes from wishlist and adds to cart in one action
export const moveToCart = async (req, res, next) => {
  try {
    // Step 1 — pull the item out of the wishlist
    const item = await wishlistService.moveToCartService(req.user._id, req.params.productId);

    // Step 2 — add it to the cart (quantity defaults to 1)
    // was req.user.id — every other handler in this codebase uses
    // req.user._id, and req.user.id was undefined (no such field on the
    // JWT-derived user object), which is what triggered the 500.
    const cart = await cartService.addToCartService(req.user._id, {
      productId: item.productId,
      shopId: item.shopId,
      quantity: 1,
    });

    res.status(200).json({
      success: true,
      message: "Product moved to cart.",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

