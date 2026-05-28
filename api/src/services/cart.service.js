


import CartModel from "../models/Cart.model.js";
import ProductModel from "../models/Product.model.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/AppError.js";

// ─── Helper: recalculate totalPrice from items array ─────────────────────────
const recalcTotal = (items) => items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);

// ─── Get cart for the logged-in user ─────────────────────────────────────────
export const getCartService = async (userId) => {
  const cart = await CartModel.findOne({ user_id: userId }).populate(
    "items.productId",
    "name images price discountPrice stock",
  );

  // Return an empty cart shape if none exists yet
  if (!cart) return { user_id: userId, items: [], totalPrice: 0 };

  return cart;
};

// ─── Add item to cart ─────────────────────────────────────────────────────────
export const addToCartService = async (userId, { productId, quantity = 1 }) => {
  // if product id not provide
  if (!productId) {
    throw new BadRequestError("Product ID is required.");
  }

  /// if quantity are invalid add then
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new BadRequestError("Quantity must be a positive integer.");
  }
  // Validate the product exists and has enough stock
  const product = await ProductModel.findById(productId).lean();
  if (!product) throw new NotFoundError("Product not found.");
  if (product.stock < quantity) {
    throw new BadRequestError(`Only ${product.stock} unit(s) in stock.`);
  }

  let priceAtAdd = 0
  // console.log(product.discountPercent > 0)
  if (product.discountPercent > 0) {
    priceAtAdd = product.discountPrice
  } else {
    priceAtAdd = product.price
  }


  let cart = await CartModel.findOne({ user_id: userId });

  if (!cart) {
    // First item — create the cart
    cart = await CartModel.create({
      user_id: userId,
      items: [{ productId, quantity, priceAtAdd }],
      totalPrice: priceAtAdd * quantity,
    });
    return cart;
  }

  // Check if this product is already in the cart
  const existingIndex = cart.items.findIndex(
    (i) => i.productId.toString() === productId.toString(),
  );


  if (existingIndex > -1) {
    // Increase quantity
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (product.stock < newQty) {
      throw new BadRequestError(`Only ${product.stock} unit(s) available. You already have ${cart.items[existingIndex].quantity} in your cart.`);
    }
    cart.items[existingIndex].quantity = newQty;
    cart.items[existingIndex].priceAtAdd = priceAtAdd;

    // console.log(cart.items[existingIndex])

  } else {
    cart.items.push({ productId, quantity, priceAtAdd });
  }

  cart.totalPrice = recalcTotal(cart.items);
  await cart.save();

  return cart;
};

// ─── Update item quantity ─────────────────────────────────────────────────────
export const updateCartItemService = async (userId, productId, quantity) => {
  if (quantity < 1) throw new BadRequestError("Quantity must be at least 1.");

  const cart = await CartModel.findOne({ user_id: userId });
  if (!cart) throw new NotFoundError("Cart not found.");

  const item = cart.items.find((i) => i.productId.toString() === productId.toString());
  if (!item) throw new NotFoundError("Item not found in cart.");

  // Re-check stock
  const product = await ProductModel.findById(productId).select("stock");
  if (!product) throw new NotFoundError("Product not found.");
  if (product.stock < quantity) {
    throw new BadRequestError(`Only ${product.stock} unit(s) in stock.`);
  }

  item.quantity = quantity;
  cart.totalPrice = recalcTotal(cart.items);
  await cart.save();

  return cart;
};

// ─── Remove a single item from cart ──────────────────────────────────────────
export const removeCartItemService = async (userId, productId) => {
  const cart = await CartModel.findOne({ user_id: userId });
  if (!cart) throw new NotFoundError("Cart not found.");

  const before = cart.items.length;
  cart.items = cart.items.filter((i) => i.productId.toString() !== productId.toString());

  if (cart.items.length === before) {
    throw new NotFoundError("Item not found in cart.");
  }

  cart.totalPrice = recalcTotal(cart.items);
  await cart.save();

  return cart;
};

// ─── Clear entire cart ────────────────────────────────────────────────────────
export const clearCartService = async (userId) => {
  const cart = await CartModel.findOne({ user_id: userId });
  if (!cart) throw new NotFoundError("Cart not found.");

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return { message: "Cart cleared." };
};

