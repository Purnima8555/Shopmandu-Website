import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required."],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
      min: [1, "Quantity must be at least 1."],
      default: 1,
    },

    // Snapshot the price at time of adding so price changes don't silently affect the cart
    priceAtAdd: {
      type: Number,
      required: [true, "Price at add is required."],
      min: [0, "Price cannot be negative."],
    },

    // Selected variant, if the product has one. null when the product has no
    // colors/sizes defined. Two cart lines for the same product with
    // different color/size are treated as separate items.
    color: {
      type: String,
      default: null,
    },

    size: {
      type: String,
      default: null,
    },
  },
  { _id: false }, // subdocument — no separate _id needed per item
);

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      unique: true, // one cart per user
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    // Computed total — updated on every add/update/delete
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price cannot be negative."],
    },
  },
  { timestamps: true },
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;
