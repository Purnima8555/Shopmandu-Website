import mongoose from "mongoose";
import {
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_CONFIRMED,
    } from "../constants/orderStatus.js";
    import {
    PAYMENT_METHOD_CASH,
    PAYMENT_METHOD_ONLINE,
    PAYMENT_STATUS_FAILED,
    PAYMENT_STATUS_SUCCESS,
} from "../constants/payment.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { payViaKhalti } from "../utils/payment.js";
import userService from "./user.service.js";

// for admin
const getOrders = async () => {
    return await Order.find()
        .sort({ createdAt: -1 })
        .populate("user", "name email phone")
        .populate("orderItems.product", "name brand category price imageUrls");
    };

    const getOrderById = async (id) => {
    const order = await Order.findById(id)
        .populate("user", "name email phone")
        .populate("orderItems.product", "name brand category price imageUrls")
        .populate("payment", "transactionId amount method status");

    if (!order)
        throw {
        status: 404,
        message: "Order not found.",
        };

    return order;
};

const createOrder = async (data, authUser) => {
    const user = await userService.getById(authUser._id, authUser);

    if (!data.shippingAddress) {
        data.shippingAddress = user.address;
    }

    data.orderNumber = crypto.randomUUID();
    data.user = authUser._id;

    return await Order.create(data);
};

const updateOrderStatus = async (id, status) => {
    return await Order.findByIdAndUpdate(
        id,
        { status },
        { returnDocument: "after" },
    );
};

const cancelOrder = async (id) => {
    return await Order.findByIdAndUpdate(
        id,
        { status: ORDER_STATUS_CANCELLED },
        { returnDocument: "after" },
    );
};

const deleteOrder = async (id) => {
    await Order.findByIdAndDelete(id);
    };

const confirmOrder = async (id, status) => {
    const order = await getOrderById(id);

    if (status?.toUpperCase() != PAYMENT_STATUS_SUCCESS) {
        await Payment.findByIdAndUpdate(order.payment, {
        status: PAYMENT_STATUS_FAILED,
        });

        throw {
        status: 400,
        message: "Payment failed.",
        };
    }

    await Payment.findByIdAndUpdate(order.payment, {
        status: PAYMENT_STATUS_SUCCESS,
    });

    return await Order.findByIdAndUpdate(
        id,
        { status: ORDER_STATUS_CONFIRMED },
        { returnDocument: "after" },
    );
};

const getOrdersByUser = async (userId) => {
    return await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "name email phone")
        .populate("orderItems.product", "name brand category price imageUrls");
};

const getOrdersByMerchant = async (merchantId) => {
    return await Order.aggregate([
        {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "orderUser",
        },
        },
        {
        $unwind: "$orderUser",
        },
        {
        $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "orderedProducts",
        },
    },
    {
        $match: {
            "orderedProducts.createdBy": new mongoose.Types.ObjectId(merchantId),
        },
        },
        {
        $project: {
            orderNumber: 1,
            payment: 1,
            shippingAddress: 1,
            status: 1,
            totalPrice: 1,
            "orderUser._id": 1,
            "orderUser.name": 1,
            "orderUser.email": 1,
            "orderUser.phone": 1,
            "orderedProducts._id": 1,
            "orderedProducts.name": 1,
            "orderedProducts.price": 1,
            "orderedProducts.brand": 1,
            "orderedProducts.category": 1,
            "orderedProducts.imageUrls": 1,
        },
        },
    ]);
};

const orderPaymentViaCash = async (id) => {
    const order = await getOrderById(id);

    const orderPayment = await Payment.create({
        method: PAYMENT_METHOD_CASH,
        amount: order.totalPrice,
    });

    return await Order.findByIdAndUpdate(
        id,
        {
        status: ORDER_STATUS_CONFIRMED,
        payment: orderPayment.id,
        },
        { returnDocument: "after" },
    );
};

const orderPaymentViaKhalti = async (id) => {
    const order = await getOrderById(id);

    const orderPayment = await Payment.create({
        method: PAYMENT_METHOD_ONLINE,
        amount: order.totalPrice,
    });

    await Order.findByIdAndUpdate(id, {
        payment: orderPayment.id,
    });

    return await payViaKhalti({
        amount: order.totalPrice,
        purchaseOrderId: order.orderNumber,
        purchaseOrderName: order.orderItems[0].product.name,
        customerInfo: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        },
    });
};

export default {
    getOrders,
    getOrderById,
    getOrdersByMerchant,
    getOrdersByUser,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
    confirmOrder,
    orderPaymentViaCash,
    orderPaymentViaKhalti,
};
