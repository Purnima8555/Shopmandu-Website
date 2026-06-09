import crypto from "crypto";
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import OrderItemModel from "../models/orderItem.model.js";
import ProductModel from "../models/product.model.js";
import { NotFoundError, BadRequestError } from "../utils/AppError.js";

class orderServices {

    //
    // PLACE NEW ORDER
    //
    async placeNewOrder(userId, orderData) {

    const {
        items,
        shippingAddress,
        paymentMethod,
        shippingCharge = 0,
        taxAmount = 0,
        discountAmount = 0,
        couponCode,
    } = orderData;

    try {

        let subTotal = 0;

        const validatedItems = [];
        const vendorMap = {};

        // STEP 1: VALIDATE PRODUCTS (NO STOCK REDUCTION HERE)
        for (const item of items) {

            const product = await ProductModel.findById(item.productId);

            if (!product) {
                throw new NotFoundError(`Product not found: ${item.productId}`);
            }

            if (product.stock < item.quantity) {
                throw new BadRequestError(
                    `${product.name} has only ${product.stock} left`
                );
            }

            const price = product.discountPrice || product.price;
            const itemTotal = price * item.quantity;

            subTotal += itemTotal;

            // store snapshot for order history
            validatedItems.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0] || "",
                quantity: item.quantity,
                price,
            });

            // group for vendor order system
            const vendorId = product.vendorId.toString();

            if (!vendorMap[vendorId]) {
                vendorMap[vendorId] = [];
            }

            vendorMap[vendorId].push({
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0] || "",
                quantity: item.quantity,
                price,
                total: itemTotal,
                variant: {
                    color: item.color,
                    size: item.size,
                },
            });
        }

        const totalAmount =
            subTotal + shippingCharge + taxAmount - discountAmount;

        // STEP 2: CREATE ORDER (PENDING PAYMENT)
        const order = await OrderModel.create({
            customerId: userId,
            orderNumber: crypto.randomUUID(),

            shippingAddress,
            couponCode,

            items: validatedItems,

            subTotal,
            totalAmount,
            shippingCharge,
            taxAmount,
            discountAmount,

            paymentMethod,

            orderStatus: "PENDING",
            paymentStatus: "PENDING",
        });

        // STEP 3: CREATE VENDOR ORDER ITEMS (IMPORTANT)
        for (const vendorId in vendorMap) {

            const products = vendorMap[vendorId];

            const totalPrice = products.reduce(
                (sum, p) => sum + p.total,
                0
            );

            await OrderItemModel.create({
                orderId: order._id,
                vendorId,
                products,
                totalPrice,
                orderItemsStatus: "PENDING",
            });
        }

        return order;

    } catch (error) {
        throw error;
    }
}

    //
    // CUSTOMER ORDER HISTORY
    //
    async customerOrderHistory(userId) {
        return OrderModel.find({ customerId: userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });
    }

    //
    // CUSTOMER ORDER DETAIL-SINGLE ORDER
    //
    async orderDetail(userId, orderId) {
        const order = await OrderModel.findOne({
            _id: orderId,
            customerId: userId,
        });

        if (!order) throw new NotFoundError("Order not found");
        const orderItems = await OrderItemModel.find({ orderId });
        return { order, orderItems };
    }

    //
    // CUSTOMER CANCEL ORDER (CLEANED)
    //
    async orderCancel(userId, orderId) {
        const order = await OrderModel.findOne({
            _id: orderId,
            customerId: userId,
        });

        if (!order) throw new NotFoundError("Order not found");
        if (!["PENDING", "PROCESSING"].includes(order.orderStatus)) {
            throw new BadRequestError(
                `Order cannot be cancelled when status is ${order.orderStatus}`
            );
        }

        order.orderStatus = "CANCELLED";
        order.cancelledAt = new Date();
        await order.save();

        await OrderItemModel.updateMany(
            { orderId },
            { orderItemsStatus: "CANCELLED", cancelledAt: new Date() }
        );
        return order;
    }

    //
    // VENDOR GET ORDERS
    //
    async getAllOrderByVendorId(vendorId) {
        return OrderItemModel.find({ vendorId })
            .populate("orderId")
            .sort({ createdAt: -1 });
    }

    //
    // VENDOR UPDATE ORDER ITEM STATUS
    //
    async updateOrderItemStatus(vendorId, orderItemId, status) {
        const orderItem = await OrderItemModel.findOne({
            _id: orderItemId,
            vendorId,
        });

        if (!orderItem) throw new NotFoundError("Order item not found");
        orderItem.orderItemsStatus = status;

        if (status === "DELIVERED") orderItem.deliveredAt = new Date();
        if (status === "OUT_FOR_DELIVERY") orderItem.shippedAt = new Date();
        await orderItem.save();
        return orderItem;
    }

    //
    // ADMIN GET ALL ORDERS
    //
    async getAllOrder() {
        return OrderModel.find({}).sort({ createdAt: -1 });
    }

    //
    // ADMIN GET ORDERS BY STATUS
    //
    async getOrdersByStatus(status) {
        return OrderModel.find({ orderStatus: status }).sort({ createdAt: -1 });
    }

    //
    // ADMIN GET ORDER BY ID
    //
    async getOrderById(orderId) {
        const order = await OrderModel.findById(orderId);
        if (!order) throw new NotFoundError("Order not found");

        const orderItems = await OrderItemModel.find({ orderId });
        return { order, orderItems };
    }

    //
    // ADMIN UPDATE ORDER STATUS
    //
    async adminUpdateOrderStatus(orderId, orderStatus) {
        const order = await OrderModel.findById(orderId);
        if (!order) throw new NotFoundError("Order not found");

        order.orderStatus = orderStatus;

        if (orderStatus === "DELIVERED") order.deliveredAt = new Date();
        if (orderStatus === "CONFIRMED") order.confirmedAt = new Date();
        await order.save();
        return order;
    }
}

export default new orderServices();