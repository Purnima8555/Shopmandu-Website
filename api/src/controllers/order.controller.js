import orderService from "../services/order.service.js";

//
// USER - PLACE ORDER
//
export const placeNewOrder = async (req, res, next) => {
    try {
        const order = await orderService.placeNewOrder(req.user._id, req.body);

        res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
        });
    } catch (error) {
        next(error);
    }
};

//
// USER - ORDER HISTORY
//
export const customerOrderHistory = async (req, res, next) => {
    try {
        const orders = await orderService.customerOrderHistory(req.user._id);

        res.status(200).json({
        success: true,
        data: orders,
        });
    } catch (error) {
        next(error);
    }
};

//
// USER - ORDER DETAIL
//
export const orderDetail = async (req, res, next) => {
    try {
        const order = await orderService.orderDetail(
        req.user._id,
        req.params.orderId,
        );

        res.status(200).json({
        success: true,
        data: order,
        });
    } catch (error) {
        next(error);
    }
};

//
// USER - CANCEL ORDER
//
export const orderCancel = async (req, res, next) => {
    try {
        const order = await orderService.orderCancel(
        req.user._id,
        req.params.orderId,
        );

        res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
        });
    } catch (error) {
        next(error);
    }
};

//
// VENDOR - GET ORDERS
//
export const getAllOrderByVendorId = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrderByVendorId(req.user._id);

        res.status(200).json({
        success: true,
        data: orders,
        });
    } catch (error) {
        next(error);
    }
};

//
// VENDOR - UPDATE ORDER ITEM STATUS
//
export const updateOrderItemStatus = async (req, res, next) => {
    try {

        const order = await orderService.updateOrderItemStatus(
            req.user._id,
            req.params.orderItemId,
            req.body.orderItemsStatus,
        );

        res.status(200).json({
            success: true,
            message: "Order item status updated successfully",
            data: order,
        });

    } catch (error) {
        next(error);
    }
};

//
// ADMIN - GET ALL ORDERS
//
export const getAllOrder = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrder();

        res.status(200).json({
        success: true,
        data: orders,
        });
    } catch (error) {
        next(error);
    }
};

//
// ADMIN - GET ORDER STATS
//
export const getOrdersByStatus = async (req, res, next) => {
    try {
        const { status } = req.query;
        const orders = await orderService.getOrdersByStatus(status);

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

//
// ADMIN - GET ORDER BY ID
//
export const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.orderId);

        res.status(200).json({
        success: true,
        data: order,
        });
    } catch (error) {
        next(error);
    }
};

//
// ADMIN - UPDATE ORDER STATUS
//
export const adminUpdateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.adminUpdateOrderStatus(
        req.params.orderId,
        req.body.orderStatus,
        );

        res.status(200).json({
        success: true,
        message: "Order status updated",
        data: order,
        });
    } catch (error) {
        next(error);
    }
};
