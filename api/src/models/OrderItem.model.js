

import mongoose from "mongoose";
import orderStatus from "../constants/orderStatus.js";
import paymentStatus from "../constants/paymentStatus.js";
import { orderProductSchema } from "./Order.model.js";


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

    products: {
        type: [orderProductSchema],
        default: []
    },

    orderItemsStatus: {
        type: String,
        enum: [orderStatus.CANCELLED, orderStatus.CONFIRMED, orderStatus.DELIVERED, orderStatus.FAILED, orderStatus.OUT_FOR_DELIVERY, orderStatus.PARTIALLY_SHIPPED, orderStatus.PENDING, orderStatus.PROCESSING, orderStatus.RETURNED, orderStatus.RETURN_REQUESTED],
        default: orderStatus.PENDING,
        required: [true, "Item Status is required"]
    },

    paymentStatus: {
        type: String,
        enum: [paymentStatus.FAILED, paymentStatus.PAID, paymentStatus.REFUNDED, paymentStatus.PENDING, paymentStatus.UNPAID, paymentStatus.EXPIRED],
        default: paymentStatus.UNPAID,
        required: [true, "payment Status is required."]
    },
    totalPrice: {
        type: Number,
        min: 0,
        required: [true, "Total price is required."]
    },

    taxAmount: {
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

const OrderItemsModel = mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemsSchema);

export default OrderItemsModel;
