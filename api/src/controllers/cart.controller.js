import * as cartService from "../services/cart.service.js";

// GET / — get the logged-in user's cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartService(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// POST /cart/add — add a product to the cart
// Body: { productId, quantity?, color?, size? }
export const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCartService(req.user._id, req.body);
    res.status(200).json({ success: true, message: "Item added to cart.", data: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /cart/update/:productId — change quantity of an item
// Body: { quantity, color?, size? } — color/size identify which variant
// line to update when the same product appears more than once in the cart.
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, color = null, size = null } = req.body;
    const cart = await cartService.updateCartItemService(
      req.user._id,
      req.params.productId,
      quantity,
      color,
      size,
    );
    res.status(200).json({ success: true, message: "Cart updated.", data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart/delete/:productId — remove one item from cart
// Body: { color?, size? } — same disambiguation as update
export const removeCartItem = async (req, res, next) => {
  try {
    const { color = null, size = null } = req.body || {};
    const cart = await cartService.removeCartItemService(
      req.user._id,
      req.params.productId,
      color,
      size,
    );
    res.status(200).json({ success: true, message: "Item removed from cart.", data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /cart/clear — remove all items from cart
export const clearCart = async (req, res, next) => {
  try {
    const result = await cartService.clearCartService(req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
