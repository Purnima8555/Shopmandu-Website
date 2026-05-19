


import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
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
      required: [true, "Product category is required"],
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

    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
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

      validate: {
        validator: function (value) {
          // allow empty discount price
          if (value === null) return true;
          return value < this.price;
        },

        message: function (props) {
          return `Discount price (${props.value}) must be lower than original price (${this.price})`;
        },
      },
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

    totalSold: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/// indexes
productSchema.index({ slug: 1 });

/// create model
const ProductModel = mongoose.model(
  "Product",
  productSchema
);

export default ProductModel;