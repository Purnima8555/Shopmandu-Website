import crypto from "crypto";
import OrderModel from "../models/order.model.js";
import OrderItemModel from "../models/orderItem.model.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../utils/AppError.js";

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
        return OrderModel.find({ customerId: userId }).sort({ createdAt: -1 });
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