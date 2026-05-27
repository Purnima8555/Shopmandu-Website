import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";

import { NotFoundError, ForbiddenError } from "../utils/AppError.js";

class orderServices {
    //
    // PLACE NEW ORDER
    //
    async placeNewOrder(userId, cartData) {
        const { items, shippingAddressId, paymentMethod } = cartData;
        const address = await AddressModel.findById(shippingAddressId);

        if (!address) {
        throw new NotFoundError("Address not found");
    }

    //
    // CALCULATE TOTAL
    //
    let subtotal = 0;

    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const deliveryFee = 100;
    const totalAmount = subtotal + deliveryFee;

    //
    // CREATE ORDER
    //
    const order = await OrderModel.create({
        userId,

        items,

        subtotal,
        deliveryFee,
        totalAmount,

        deliveryAddress: {
            addressId: address._id,
            location: address.location,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            landmark: address.landmark,
            mobile: address.mobile,
        },

        paymentGateway: {
            provider: paymentMethod,
        },
    });

    return order;
    }

    //
    // CUSTOMER ORDER HISTORY
    //
    async customerOrderHistory(userId) {
        return await OrderModel.find({userId,}).sort({createdAt: -1,});
    }

    //
    // ORDER DETAIL
    //
    async orderDetail(userId, orderId) {
        const order = await OrderModel.findById(orderId);

        if (!order) {
        throw new NotFoundError("Order not found");
    }

    //
    // CHECK OWNER
    //
    if (order.userId.toString() !== userId.toString()) {
        throw new ForbiddenError("You can only view your own orders");
    }

    return order;
    }

    //
    // ORDER CANCEL
    //
    async orderCancel(userId, orderId) {
        const order = await OrderModel.findById(orderId);

        if (!order) {
        throw new NotFoundError("Order not found");
    }

    //
    // CHECK OWNER
    //
    if (order.userId.toString() !== userId.toString()) {
        throw new ForbiddenError("You can only cancel your own orders");
    }

    //
    // ONLY CANCEL IF PENDING
    //
    if (order.orderStatus !== "PENDING") {
        throw new ForbiddenError("Order cannot be cancelled anymore");
    }

    order.orderStatus = "CANCELLED";
    await order.save();
    return order;
    }

    //
    // GET ALL ORDERS BY VENDOR ID
    //
    async getAllOrderByVendorId(vendorId) {
        return await OrderModel.find({"items.shopId": vendorId,}).sort({createdAt: -1});
    }

    //
    // UPDATE ORDER ITEM STATUS
    //
    async updateOrderItemStatus(vendorId, orderId, orderStatus) {
        const order = await OrderModel.findById(orderId);

        if (!order) {
        throw new NotFoundError("Order not found");
    }

    //
    // CHECK VENDOR ACCESS
    //
    const hasVendorItem = order.items.some(
        (item) => item.shopId.toString() === vendorId.toString(),
    );

    if (!hasVendorItem) {
        throw new ForbiddenError("You cannot update this order");
    }

    order.orderStatus = orderStatus;
    await order.save();
    return order;
    }

    //
    // CREATE COUPON CODE
    //
    async createCouponCode(vendorId, couponCode) {
        return {
        message: "Coupon feature will be implemented later",
        };
    }

    //
    // ADMIN GET ALL ORDERS
    //
    async getAllOrder() {
        return await OrderModel.find({}).sort({createdAt: -1});
    }

    //
    // ADMIN GET ORDER STATS
    //
    async getOrdersByStatus(status) {
        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

        if (!status || !validStatuses.includes(status.toUpperCase())) {
            throw new Error("Invalid order status");
        }

        return await Order.find({ orderStatus: status.toUpperCase() })
            .sort({ createdAt: -1 })
            .populate("userId", "name email")
            .populate("items.productId", "name price image");
    }

    //
    // ADMIN GET ORDER BY ID
    //
    async getOrderById(orderId) {
        const order = await OrderModel.findById(orderId);

        if (!order) {
        throw new NotFoundError("Order not found");
        }

        return order;
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
        await order.save();
        return order;
    }
}

export default new orderServices();
