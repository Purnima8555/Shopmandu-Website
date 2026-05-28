import crypto from "crypto";
import OrderModel from "../models/order.model.js";
import OrderItemModel from "../models/orderItem.model.js";
import { NotFoundError, ForbiddenError } from "../utils/AppError.js";

class orderServices {

    //
    // PLACE NEW ORDER
    //
    async placeNewOrder(userId, orderData) {

        const {
            items,
            shippingAddress,
            paymentMethod,
            subTotal,
            totalAmount,
            shippingCharge = 0,
            taxAmount = 0,
            discountAmount = 0,
            couponCode,
        } = orderData;

        //
        // CREATE MAIN ORDER
        //
        const order = await OrderModel.create({
            customerId: userId,
            orderNumber: crypto.randomUUID(),

            shippingAddress,
            couponCode,

            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),

            subTotal,
            totalAmount,
            shippingCharge,
            taxAmount,
            discountAmount,

            paymentMethod,
        });

        //
        // GROUP ITEMS BY VENDOR
        //
        const vendorMap = {};

        for (const item of items) {

            if (!vendorMap[item.vendorId]) {
                vendorMap[item.vendorId] = [];
            }

            vendorMap[item.vendorId].push({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
                productImage: item.productImage,

                variant: {
                    color: item.color,
                    size: item.size,
                },
            });
        }

        //
        // CREATE ORDER ITEMS
        //
        for (const vendorId in vendorMap) {

            const products = vendorMap[vendorId];
            const totalPrice = products.reduce(
                (acc, item) => acc + item.total,
                0,
            );

            await OrderItemModel.create({
                orderId: order._id,
                vendorId,
                products,
                totalPrice,
            });
        }
        return order;
    }

    //
    // CUSTOMER ORDER HISTORY
    //
    async customerOrderHistory(userId) {

        return await OrderModel.find({
            customerId: userId,
        }).sort({ createdAt: -1 });

    }

    //
    // CUSTOMER ORDER DETAIL
    //
    async orderDetail(userId, orderId) {

        const order = await OrderModel.findById(orderId);

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        if (order.customerId.toString() !== userId.toString()) {
            throw new ForbiddenError("Unauthorized access");
        }

        const orderItems = await OrderItemModel.find({
            orderId: order._id,
        });

        return {
            order,
            orderItems,
        };
    }

    //
    // CUSTOMER CANCEL ORDER
    //
    async orderCancel(userId, orderId) {

        const order = await OrderModel.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        if (order.customerId.toString() !== userId.toString()) {
            throw new ForbiddenError("Unauthorized access");
        }

        order.orderStatus = "CANCELLED";
        order.cancelledAt = new Date();

        await order.save();

        await OrderItemModel.updateMany(
            { orderId: order._id },
            {
                orderItemsStatus: "CANCELLED",
                cancelledAt: new Date(),
            },
        );

        return order;
    }

    //
    // VENDOR GET ORDERS
    //
    async getAllOrderByVendorId(vendorId) {

        return await OrderItemModel.find({
            vendorId,
        })
        .populate("orderId")
        .sort({ createdAt: -1 });
    }

    //
    // VENDOR UPDATE ORDER ITEM STATUS
    //
    async updateOrderItemStatus(vendorId, orderItemId, orderItemsStatus) {

        const orderItem = await OrderItemModel.findById(orderItemId);
        if (!orderItem) {
            throw new NotFoundError("Order item not found");
        }

        if (orderItem.vendorId.toString() !== vendorId.toString()) {
            throw new ForbiddenError("Unauthorized access");
        }

        orderItem.orderItemsStatus = orderItemsStatus;

        if (orderItemsStatus === "DELIVERED") {
            orderItem.deliveredAt = new Date();
        }

        if (orderItemsStatus === "OUT_FOR_DELIVERY") {
            orderItem.shippedAt = new Date();
        }

        await orderItem.save();
        return orderItem;
    }

    //
    // ADMIN GET ALL ORDERS
    //
    async getAllOrder() {
        return await OrderModel.find({})
            .sort({ createdAt: -1 });

    }

    //
    // ADMIN GET ORDERS BY STATUS
    //
    async getOrdersByStatus(status) {
        return await OrderModel.find({ orderStatus: status, })
            .sort({ createdAt: -1 });
    }

    //
    // ADMIN GET ORDER BY ID
    //
    async getOrderById(orderId) {

        const order = await OrderModel.findById(orderId);
        if (!order) {
            throw new NotFoundError("Order not found");
        }

        const orderItems = await OrderItemModel.find({
            orderId,
        });

        return {
            order,
            orderItems,
        };
    }

    //
    // ADMIN UPDATE ORDER STATUS
    //
    async adminUpdateOrderStatus(orderId, orderStatus) {

        const order = await OrderModel.findById(orderId);

        if (!order) {
            throw new NotFoundError("Order not found");
        }
        order.orderStatus = orderStatus;
        if (orderStatus === "DELIVERED") {
            order.deliveredAt = new Date();
        }
        if (orderStatus === "CONFIRMED") {
            order.confirmedAt = new Date();
        }
        await order.save();
        return order;
    }
}

export default new orderServices();