import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
    {
        orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        },

        orderItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
        },

        productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        },

        customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        quantity: {
        type: Number,
        default: 1,
        },

        reason: {
        type: String,
        required: true,
        },

        description: {
        type: String,
        },

        images: {
        type: [String],
        default: [],
        },

        status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "RETURNED", "REFUNDED", "REFUND_REJECTED"],
        default: "PENDING",
        },

        refundedAt: {
        type: Date,
        },
    },
    { timestamps: true },
);

returnRequestSchema.index({ customerId: 1 });
returnRequestSchema.index({ vendorId: 1 });
returnRequestSchema.index({ orderId: 1 });

const ReturnRequestModel = mongoose.model("ReturnRequest", returnRequestSchema);

export default ReturnRequestModel;
