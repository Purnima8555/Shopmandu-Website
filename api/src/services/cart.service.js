import CartModel from "../models/Cart.model.js";
import ProductModel from "../models/Product.model.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/AppError.js";

// ─── Helper: recalculate totalPrice from items array ─────────────────────────
const recalcTotal = (items) => items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);

// ─── Helper: does a cart item match this product + variant selection? ────────
// null/undefined color or size are normalized to null so "no variant" always
// matches "no variant" consistently.
const matchesVariant = (item, productId, color, size) =>
  item.productId.toString() === productId.toString() &&
  (item.color ?? null) === (color ?? null) &&
  (item.size ?? null) === (size ?? null);

// ─── Helper: validate a requested color/size against the product's options ───
const validateVariant = (product, color, size) => {
  if (product.colors?.length > 0) {
    if (!color) throw new BadRequestError("Please select a color.");
    if (!product.colors.includes(color)) {
      throw new BadRequestError(`Invalid color. Available: ${product.colors.join(", ")}`);
    }
  }

  if (product.sizes?.length > 0) {
    if (!size) throw new BadRequestError("Please select a size.");
    if (!product.sizes.includes(size)) {
      throw new BadRequestError(`Invalid size. Available: ${product.sizes.join(", ")}`);
    }
  }
};

// ─── Get cart for the logged-in user ─────────────────────────────────────────
export const getCartService = async (userId) => {
  const cart = await CartModel.findOne({ user_id: userId }).populate(
    "items.productId",
    "name images price discountPrice discountPercent stock colors sizes",
  );

  // Return an empty cart shape if none exists yet
  if (!cart) return { user_id: userId, items: [], totalPrice: 0 };

  return cart;
};

// ─── Add item to cart ─────────────────────────────────────────────────────────
export const addToCartService = async (userId, { productId, quantity = 1, color = null, size = null }) => {
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

  validateVariant(product, color, size);

  let priceAtAdd = 0;
  if (product.discountPercent > 0) {
    priceAtAdd = product.discountPrice;
  } else {
    priceAtAdd = product.price;
  }

  let cart = await CartModel.findOne({ user_id: userId });

  if (!cart) {
    // First item — create the cart
    cart = await CartModel.create({
      user_id: userId,
      items: [{ productId, quantity, priceAtAdd, color, size }],
      totalPrice: priceAtAdd * quantity,
    });
    await cart.populate("items.productId", "name images price discountPrice discountPercent stock colors sizes");
    return cart;
  }

  // Check if this exact product + variant is already in the cart
  const existingIndex = cart.items.findIndex((i) => matchesVariant(i, productId, color, size));

  if (existingIndex > -1) {
    // Increase quantity on the matching variant line
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (product.stock < newQty) {
      throw new BadRequestError(`Only ${product.stock} unit(s) available. You already have ${cart.items[existingIndex].quantity} in your cart.`);
    }
    cart.items[existingIndex].quantity = newQty;
    cart.items[existingIndex].priceAtAdd = priceAtAdd;
  } else {
    // New line — either a different product, or the same product with a
    // different color/size than what's already in the cart
    cart.items.push({ productId, quantity, priceAtAdd, color, size });
  }

  cart.totalPrice = recalcTotal(cart.items);
  await cart.save();
  await cart.populate("items.productId", "name images price discountPrice discountPercent stock colors sizes");

  return cart;
};

// ─── Update item quantity ─────────────────────────────────────────────────────
export const updateCartItemService = async (userId, productId, quantity, color = null, size = null) => {
  if (quantity < 1) throw new BadRequestError("Quantity must be at least 1.");

  const cart = await CartModel.findOne({ user_id: userId });
  if (!cart) throw new NotFoundError("Cart not found.");

  const item = cart.items.find((i) => matchesVariant(i, productId, color, size));
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
  await cart.populate("items.productId", "name images price discountPrice discountPercent stock colors sizes");

  return cart;
};

// ─── Remove a single item from cart ──────────────────────────────────────────
export const removeCartItemService = async (userId, productId, color = null, size = null) => {
  const cart = await CartModel.findOne({ user_id: userId });
  if (!cart) throw new NotFoundError("Cart not found.");

  const before = cart.items.length;
  cart.items = cart.items.filter((i) => !matchesVariant(i, productId, color, size));

  if (cart.items.length === before) {
    throw new NotFoundError("Item not found in cart.");
  }

  cart.totalPrice = recalcTotal(cart.items);
  await cart.save();
  await cart.populate("items.productId", "name images price discountPrice discountPercent stock colors sizes");

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