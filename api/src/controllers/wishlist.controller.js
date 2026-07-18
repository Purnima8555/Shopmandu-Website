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
    const wishlist = await wishlistService.addToWishlistService(
      req.user._id,
      req.body,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Product added to wishlist.",
        data: wishlist,
      });
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
    res
      .status(200)
      .json({
        success: true,
        message: "Product removed from wishlist.",
        data: wishlist,
      });
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
    // Add to cart first
    const cart = await cartService.addToCartService(req.user._id, {
      productId: req.params.productId,
      quantity: 1,
    });

    // Only remove if add succeeded
    await wishlistService.removeFromWishlistService(
      req.user._id,
      req.params.productId,
    );

    res.status(200).json({
      success: true,
      message: "Product moved to cart.",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
