

import mongoose from "mongoose";
import currencyType from "../constants/currencyType.js";
import paymentMethod from "../constants/paymentMethod.js";
import paymentStatus from "../constants/paymentStatus.js";

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order Id is required."],
        index: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer Id is required."]
    },

    amount: {
        type: Number,
        required: [true, "Amount is required."],
        min: [0, "Amount must be positive."]
    },

    currency: {
        type: String,
        enum: [currencyType.USD, currencyType.NPR],
        default: currencyType.NPR
    },

    gateway: {
        type: String,
        enum: [paymentMethod.KHALTI, paymentMethod.ESEWA, paymentMethod.STRIPE],
        default: paymentMethod.KHALTI
    },
    gatewayTransactionId: {
        type: String,
        unique: true
    },

    status: {
        type: String,
        enum: [paymentStatus.FAILED, paymentStatus.PAID, paymentStatus.PENDING, paymentStatus.REFUNDED,],
        default: paymentStatus.PENDING
    },

    paidAt: {
        type: Date,
    },
    refundAmount: {
        type: Number,
        min: 0,
        default: 0,
        validate: {
            validator: function (v) {
                return v <= this.amount;
            },
            message: "Refund cannot exceed payment amount."
        }
    },
    refundReason: {
        type: String,
    },
    refundedAt: {
        type: Date,

    }
}, { timestamps: true })

const PaymentModel = mongoose.model("Payment", paymentSchema);

export default PaymentModel;


