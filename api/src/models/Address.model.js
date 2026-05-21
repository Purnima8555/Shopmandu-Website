import mongoose from "mongoose";
import addressType from "../constants/addressType.js";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },

    addressType: {
      type: String,
      enum: {
        values: [
          addressType.HOME,
          addressType.OFFICE,
          addressType.BILLING,
          addressType.SHOP,
          addressType.PICKUP,
          addressType.OTHER,
        ],
        message: "Invalid address type.",
      },
      default: addressType.HOME,
      required: [true, "address type is required."],
    },

    location: {
      type: String,
      required: [true, "locality is required."],
    },

    city: {
      type: String,
      required: [true, "city is required."],
    },

    mobile: {
      type: String,
      required: [true, "mobile number is required."],
    },

    state: {
      type: String,
      required: [true, "state is required."],
    },

    pincode: {
      type: String,
    },

    landmark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;