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
        required: true,
        min: 1,
        default: 1
        },
        reason: {
            type: String,
            required: true,
            enum: ["DEFECTIVE", "WRONG_ITEM", "SIZE_ISSUE", "NOT_AS_DESCRIBED", "CHANGE_OF_MIND", "OTHER"],
        },
        description: {
            type: String,
        },
        images: {
            type: [String],
            default: [],
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        refundAmount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED", "REFUNDED"],
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

const ReturnRequestModel = mongoose.models.ReturnRequest ||mongoose.model("ReturnRequest", returnRequestSchema);

export default ReturnRequestModel;