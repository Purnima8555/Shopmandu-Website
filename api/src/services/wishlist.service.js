




import WishlistModel from "../models/Wishlist.model.js";
import ProductModel from "../models/Product.model.js";
import { NotFoundError, BadRequestError } from "../utils/AppError.js";

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
export const addToWishlistService = async (userId, { productId, shopId }) => {
  // Confirm the product actually exists
  const product = await ProductModel.findById(productId);
  if (!product) throw new NotFoundError("Product not found.");

  let wishlist = await WishlistModel.findOne({ user_id: userId });

  if (!wishlist) {
    // First item — create the wishlist
    wishlist = await WishlistModel.create({
      user_id: userId,
      items: [{ productId, shopId }],
    });
    return wishlist;
  }

  // Prevent duplicates
  const alreadyAdded = wishlist.items.some(
    (i) => i.productId.toString() === productId.toString(),
  );

  if (alreadyAdded) {
    throw new BadRequestError("Product is already in your wishlist.");
  }

  wishlist.items.push({ productId, shopId });
  await wishlist.save();

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
