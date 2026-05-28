


import mongoose, { mongo } from "mongoose";
import orderStatus from "../constants/orderStatus.js";
import paymentStatus from "../constants/paymentStatus.js";
import paymentMethod from "../constants/paymentMethod.js";


const orderSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer Id is required."],
    },
    orderNumber: {
        type: String,
        required: [true, "Order Number is required."],
        unique: [true, "order number should be unique."]
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: [true, "Shipping Address Id is required."]
    },


    couponCode: {
        type: String,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "product id is required."]
            },
            quantity: {
                type: Number,
                min: [1, "quantity must be 1."],
                default: 1,
                required: [true, "product quantity is required"]
            },
            price: {
                type: Number,
                min: 0,
                required: [true, "Product Price is required."]
            }
        }
    ],

    orderStatus: {
        type: String,
        enum: [orderStatus.CANCELLED, orderStatus.CONFIRMED, orderStatus.DELIVERED, orderStatus.FAILED, orderStatus.OUT_FOR_DELIVERY, orderStatus.PARTIALLY_SHIPPED, orderStatus.PENDING, orderStatus.PROCESSING, orderStatus.RETURNED, orderStatus.RETURN_REQUESTED],
        default: orderStatus.PENDING,
        required: [true, "order Status is required."]
    },
    subTotal: {
        type: Number,
        min: 0,
        required: [true, "subTotal is required."]
    },
    discountAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
    shippingCharge: {
        type: Number,
        min: 0,
        default: 0
    },
    taxAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    totalAmount: {
        type: Number,
        min: 0,
        required: [true, "Total Ammount is required."],
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
    paymentStatus: {
        type: String,
        enum: [paymentStatus.FAILED, paymentStatus.PAID, paymentStatus.REFUNDED, paymentStatus.PENDING, paymentStatus.UNPAID],
        default: paymentStatus.PENDING,
        required: [true, "payment Status is required."]
    },

    paymentMethod: {
        type: String,
        enum: [paymentMethod.CASH_ON_DELIVERY, paymentMethod.ESEWA, paymentMethod.STRIPE, paymentMethod.KHALTI],
        required: [true, "payment method is required."]
    },
    cancelledAt:{
        type: Date,
        immutable: true
    },
    cancelReason: {
        type: String,
    },


    confirmedAt: {
        type: Date,
        immutable: true
    },
    paidAt: {
        type: Date,
        immutable: true,
    },
    shippedAt: {
        type: Date,
        immutable: true,
    },
    deliveredAt: {
        type: Date,
        immutable: true,
    }


}, { timestamps: true })

orderSchema.index({ customerId: 1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ createdAt: -1 })



const OrderModel = mongoose.model("Order", orderSchema)

export default OrderModel;
