import ReturnRequestModel from "../models/returnRequest.model.js";
import OrderModel from "../models/order.model.js";
import OrderItemsModel from "../models/orderItem.model.js";
import ProductModel from "../models/product.model.js";
import CloudinaryUpload from "../utils/CloudinaryUpload.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import mongoose from "mongoose";

class ReturnService {

    /// create requests
    async createReturnRequest(customerId, data, files) {
        const {
            orderId,
            orderItemId,
            productId,
            quantity = 1,
            reason,
            description,
        } = data;

        // check order
        const order = await OrderModel.findOne({
            _id: orderId,
            customerId,
        }).lean();

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        if (order.orderStatus !== "DELIVERED") {
            throw new BadRequestError("Only delivered orders can be returned.");
        }

        // check order item
        const orderItem = await OrderItemsModel.findOne({
            _id: orderItemId,
            orderId,
        }).lean();

        if (!orderItem) {
            throw new NotFoundError("Order item not found");
        }

        // find purchased product
        const purchasedProduct = orderItem.products.find(
            (p) => p.productId.toString() === productId
        );

        if (!purchasedProduct) {
            throw new BadRequestError("Product not found in this order item");
        }

        // validate return quantity
        if (quantity > purchasedProduct.quantity) {
            throw new BadRequestError(
                `You can return a maximum of ${purchasedProduct.quantity} item(s).`
            );
        }

        // duplicate check
        const existing = await ReturnRequestModel.exists({
            orderItemId,
            productId,
        });

        if (existing) {
            throw new BadRequestError(
                "Return request already exists for this product."
            );
        }

        // calculate refund values automatically
        const unitPrice = purchasedProduct.price;
        const refundAmount = unitPrice * quantity;

        // upload images
        let uploadedImages = [];

        if (files?.length > 0) {
            const uploaded = await CloudinaryUpload.uploadMultipleImage(
                files,
                "upload"
            );

            uploadedImages = uploaded.map(img => img.secure_url);
        }

        // create return request
        const returnRequest = await ReturnRequestModel.create({
            orderId,
            orderItemId,
            productId,
            customerId,
            vendorId: orderItem.vendorId,
            quantity,
            unitPrice,
            refundAmount,
            reason,
            description,
            images: uploadedImages,
            status: "PENDING",
        });

        return returnRequest;
    }

    /// customer getrquests
    async getCustomerRequests(customerId, query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { customerId };

        if (query.status) {
            filter.status = query.status;
        }

        const [data, total] = await Promise.all([
            ReturnRequestModel.find(filter)
                .populate("orderId", "orderNumber totalAmount orderStatus")
                .populate("orderItemId", "orderItemsStatus totalPrice")
                .populate("productId","name images")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ReturnRequestModel.countDocuments(filter)
        ]);

        return {
            metadata: {
                totalResults: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            },
            data
        };
    }

    /// VENDOR - Get Return Requests
async getVendorRequests(vendorId, query = {}) {

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [];

    // Vendor Filter
    pipeline.push({
        $match: {vendorId: new mongoose.Types.ObjectId(vendorId),},
    });

    // Status Filter
    if (query.status) {
        pipeline.push({
            $match: {status: query.status,},
        });
    }

    // Populate Customer
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerId",
        },
    });

    pipeline.push({
        $unwind: "$customerId",
    });

    // Populate Product
    pipeline.push({
        $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productId",
        },
    });

    pipeline.push({
        $unwind: "$productId",
    });

    // Populate Order
    pipeline.push({
        $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "orderId",
        },
    });

    pipeline.push({
        $unwind: "$orderId",
    });

    // Search
    if (query.search) {
        const regex = new RegExp(query.search, "i");
        pipeline.push({
            $match: {
                $or: [
                    { "orderId.orderNumber": regex },
                    { "productId.name": regex },
                    { "customerId.userName": regex },
                ],
            },
        });
    }

    pipeline.push({
        $facet: {
            metadata: [{$count: "total",},],
            data: [{$sort: {createdAt: -1,},},
                {$skip: skip,},
                {$limit: limit,},
            ],
        },
    });

    const result = await ReturnRequestModel.aggregate(pipeline);
    const totalResults = result[0].metadata[0]?.total || 0;

    return {
        metadata: {
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            currentPage: page,
            limit,
            hasNextPage: page < Math.ceil(totalResults / limit),
            hasPrevPage: page > 1,
        },

        data: result[0].data,
    };
}

    /// APPROVE
    async approveRequest(requestId, vendorId) {
        const request = await ReturnRequestModel.findOne({
            _id: requestId,
            vendorId,
        });

        if (!request) throw new NotFoundError("Request not found");

        request.status = "APPROVED";
        return await request.save();
    }

    /// REJECT
    async rejectRequest(requestId, vendorId) {
        const request = await ReturnRequestModel.findOne({
            _id: requestId,
            vendorId,
        });

        if (!request) throw new NotFoundError("Request not found");

        request.status = "REJECTED";
        return await request.save();
    }

    /// REFUND
    async refundRequest(requestId, vendorId) {

        const request = await ReturnRequestModel.findOne({
            _id: requestId,
            vendorId,
        });

        if (!request) {
            throw new NotFoundError("Request not found");
        }

        if (request.status !== "APPROVED") {
            throw new BadRequestError(
                "Only approved requests can be refunded."
            );
        }

        // Restock if item is resellable
        const restockReasons = [
            "WRONG_ITEM",
            "SIZE_ISSUE",
            "NOT_AS_DESCRIBED",
            "CHANGE_OF_MIND"
        ];

        if (restockReasons.includes(request.reason)) {

            await ProductModel.findByIdAndUpdate(
                request.productId,
                {
                    $inc: {
                        stock: request.quantity
                    }
                }
            );
        }

        request.status = "REFUNDED";
        request.refundedAt = new Date();

        await request.save();

        return {
            request,
            refundAmount: request.refundAmount,
            quantity: request.quantity,
            unitPrice: request.unitPrice
        };
    }

    /// ADMIN - get all return requests
    async getAllReturnRequests(query = {}) {

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (query.status) {
            filter.status = query.status;
        }

        const [data, total] = await Promise.all([

            ReturnRequestModel.find(filter)
                .populate("customerId", "userName email")
                .populate("vendorId", "userName email")
                .populate("orderId", "orderNumber")
                .populate("productId","name images")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ReturnRequestModel.countDocuments(filter)

        ]);

        return {
            metadata: {
                totalResults: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },

            data,
        };
    }
}

export default new ReturnService();