


import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required."],
    },

    // shopId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Shop",
    //   required: [true, "Shop ID is required."],
    // },
  },
  { _id: false }, // no separate _id per item — productId is the unique key
);

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      unique: true, // one wishlist per user
    },

    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel;





