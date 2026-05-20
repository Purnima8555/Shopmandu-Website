import mongoose from "mongoose";
import { OrderStatus, PaymentStatus } from "../constants/orderStatus.js";

const orderSchema = new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required."],
        },
        items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required."],
            },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "VendorProfile",
                required: [true, "Vendor ID is required."],
            },
            shopId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Shop",
                required: [true, "Shop ID is required."],
            },
            name: {
                type: String,
                required: [true, "Product name is required."],
            },
            price: {
                type: Number,
                required: [true, "Price snapshot is required."],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required."],
                min: [1, "Quantity must be at least 1."],
            },
            image: {
                type: String,
                required: [true, "Product image snapshot is required."],
            },
            selectedColor: { type: String },
            selectedSize: { type: String },
        },
        ],
        subtotal: {
            type: Number,
            required: [true, "Subtotal is required."],
            min: [0, "Subtotal cannot be negative."],
        },
        deliveryFee: {
            type: Number,
            required: [true, "fee is required."],
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required."],
            min: [0, "Total amount cannot be negative."],
        },
        deliveryAddress: {
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: [true, "Origin address ID reference is required."],
        },
        location: { type: String, required: [true, "Locality is required."] },
        city: { type: String, required: [true, "City is required."] },
        state: { type: String, required: [true, "State is required."] },
        pincode: { type: String },
        landmark: { type: String },
        mobile: {
            type: String,
            required: [true, "Contact mobile number is required."],
        },
        },
        orderStatus: {
            type: String,
            enum: [
                OrderStatus.PENDING,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED,
            ],
            default: OrderStatus.PENDING,
        },
        paymentStatus: {
            type: String,
            enum: [
                PaymentStatus.UNPAID,
                PaymentStatus.PAID,
                PaymentStatus.FAILED,
                PaymentStatus.REFUNDED,
            ],
            default: PaymentStatus.UNPAID,
        },
        paymentGateway: {
            provider: {
                type: String,
                default: "COD",
        },
        transactionId: {
            type: String,
            sparse: true,
        },
        },
    },
    { timestamps: true },
);

orderSchema.index({ userId: 1 });
orderSchema.index({ "items.vendorId": 1 });

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
