


import mongoose from "mongoose";
import productStatus from "../constants/productStatus.js";

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor Id is required"],
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop Id is required"],
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxlength: [80, "Name cannot exceed 80 characters"],
      minlength: [3, "Name length must be greater than 3"],
    },

    slug: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Slug is required"],
      lowercase: true,
      index: true,
    },

    productStatus: {
      type: String,
      enum: [
        productStatus.ACTIVE,
        productStatus.INACTIVE,
        productStatus.OUT_OF_STOCK,
      ],
      default: productStatus.INACTIVE,
      required: [true, "product status is required."],
    },

    description: {
      type: String,
      trim: true,
      default: "Generating description...",
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description too long"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: 0,
      // validate: {
      //   validator: function (value) {
      //     // allow empty discount price
      //     if (value === null) return true;
      //     return value < this.price;
      //   },

      //   message: function (props) {
      //     return `Discount price (${props.value}) must be lower than original price (${this.price})`;
      //   },
      // },
    },

    discountPercent: {
      type: Number,
      min: [0, "Discount percent cannot be negative"],
      max: [99, "Discount percent cannot exceed 99"],
      default: 0,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },

    images: {
      type: [String],
      default: [],
    },

    videos: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    brand: {
      type: String,
      trim: true,
    },

    productWeight: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Product weight is required."],
      default: 0,
    },

    boxVolume: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, "Product volume is required."],
      default: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalReviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    inReserve: {
      type: Number,
      default: 0,
      min: 0,
    },

    releasedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    flashSales: {
      type: Boolean,
      default: false,
    },

    totalSold: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/// indexes
// productSchema.index({ slug: 1 });

/// create model
const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;