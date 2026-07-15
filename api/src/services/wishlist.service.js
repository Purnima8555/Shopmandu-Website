




import WishlistModel from "../models/Wishlist.model.js";
import ProductModel from "../models/Product.model.js";
import { NotFoundError } from "../utils/AppError.js";

// ─── Get wishlist ─────────────────────────────────────────────────────────────
export const getWishlistService = async (userId) => {
  const wishlist = await WishlistModel.findOne({ user_id: userId }).populate(
    "items.productId",
    "name images price discountPrice discountPercent stock rating brand slug",
  );

  // Return empty wishlist shape if none exists yet
  if (!wishlist) return { user_id: userId, items: [] };

  return wishlist;
};

// ─── Add product to wishlist ──────────────────────────────────────────────────
// Uses findOneAndUpdate + $addToSet instead of find-then-push-then-save.
// The old version read the wishlist, checked for a duplicate in JS, then
// pushed and saved as separate steps — under a fast double-click (or a
// re-fired click handler) two requests could both pass the duplicate check
// before either saved, producing two entries for the same product (this is
// what caused the duplicate React key warning on the wishlist page).
// $addToSet compares the whole subdocument for equality and only inserts if
// no match exists, so this is safe even if two requests race — the second
// one is just a no-op instead of an error.
export const addToWishlistService = async (userId, { productId, shopId }) => {
  // Confirm the product actually exists
  const product = await ProductModel.findById(productId);
  if (!product) throw new NotFoundError("Product not found.");

  const wishlist = await WishlistModel.findOneAndUpdate(
    { user_id: userId },
    { $addToSet: { items: { productId, shopId } } },
    { upsert: true, new: true },
  );

  return wishlist;
};

// ─── Remove a single product from wishlist ────────────────────────────────────
export const removeFromWishlistService = async (userId, productId) => {
  const wishlist = await WishlistModel.findOne({ user_id: userId });
  if (!wishlist) throw new NotFoundError("Wishlist not found.");

  const before = wishlist.items.length;
  wishlist.items = wishlist.items.filter(
    (i) => i.productId.toString() !== productId.toString(),
  );

  if (wishlist.items.length === before) {
    throw new NotFoundError("Product not found in wishlist.");
  }

  await wishlist.save();
  return wishlist;
};

// ─── Clear entire wishlist ────────────────────────────────────────────────────
export const clearWishlistService = async (userId) => {
  const wishlist = await WishlistModel.findOne({ user_id: userId });
  if (!wishlist) throw new NotFoundError("Wishlist not found.");

  wishlist.items = [];
  await wishlist.save();

  return { message: "Wishlist cleared." };
};

// ─── Move item from wishlist to cart ─────────────────────────────────────────
// Removes from wishlist and returns the item details so the
// cart controller can immediately call addToCartService.
export const moveToCartService = async (userId, productId) => {
  const wishlist = await WishlistModel.findOne({ user_id: userId });
  if (!wishlist) throw new NotFoundError("Wishlist not found.");

  const itemIndex = wishlist.items.findIndex(
    (i) => i.productId.toString() === productId.toString(),
  );

  if (itemIndex === -1) throw new NotFoundError("Product not found in wishlist.");

  const [item] = wishlist.items.splice(itemIndex, 1);
  await wishlist.save();

  // Return the item so the caller can add it to the cart
  return { productId: item.productId, shopId: item.shopId };
};
