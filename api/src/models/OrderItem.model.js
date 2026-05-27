

import mongoose from "mongoose";
import orderStatus from "../constants/orderStatus.js";


const orderItemsSchema = new mongoose.Schema({

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order Id is required."],
    },

    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "vendor Id is required."]
    },

    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id is required"]
        },
        productName: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        price: {
            type: Number,
            min: 0,
            required: [true, "Product price is required."]
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1,
            required: [true, "Product Quantity is required."]
        },

        total: {
            type: Number,
            min: 0,
            required: [true, "Product Total price is required."]
        },
       productImage: String,
        variant: {
            color: String,
            size: String
        }
    }],

    orderItemsStatus: {
        type: String,
        enum: [orderStatus.CANCELLED, orderStatus.CONFIRMED, orderStatus.DELIVERED, orderStatus.FAILED, orderStatus.OUT_FOR_DELIVERY, orderStatus.PARTIALLY_SHIPPED, orderStatus.PENDING, orderStatus.PROCESSING, orderStatus.RETURNED, orderStatus.RETURN_REQUESTED],
        default: orderStatus.PENDING,
        required: [true, "Item Status is required"]
    },

    totalPrice: {
        type: Number,
        min: 0,
        required: [true, "Total price is required."]
    },

    shippedAt: {
        type: Date,
        immutable: true
    },
    deliveredAt: {
        type: Date,
        immutable: true,
    },
    cancelledAt: {
        type: Date,
        immutable: true,
    },
    cancelReason: {
        type: String,
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
    vendorEarning: {
        type: Number,
        min: 0
    },
    commissionAmount: {
        type: Number,
        min: 0
    },

    trackingNumber: {
        type: String,
    }



}, { timestamps: true })



orderItemsSchema.index({ orderId: 1 })
orderItemsSchema.index({ vendorId: 1 })
orderItemsSchema.index({ orderItemsStatus: 1 })

const OrderItemsModel = mongoose.model("OrderItem", orderItemsSchema);

export default OrderItemsModel;
