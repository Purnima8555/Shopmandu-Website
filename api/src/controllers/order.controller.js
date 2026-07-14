import client from "../config/redis.config.js";
import orderService from "../services/order.service.js"



const orderPlace = async (req, res, next) => {
    const cartData = req.body
    const userId = req.user._id

    /// guard for prevent duplicate order.
    const orderKey = `order:user:${userId}`;
    const lock = await client.set(
        orderKey,
        "Order In Processing",
        { EX: 30, NX: true });

    if (!lock) {
        res.status(200).json({
            message: "Order already being processed. wait a minute"
        })
        return;
    }
    try {
        const order = await orderService.placeNewOrder(userId, cartData)

        res.status(200).json({
            message: "Order Create.",
            data: order
        })

    } catch (error) {
        await client.del(orderKey);
        next(error)
    }

}

const cancelOrder = async (req, res, next) => {

    try {

        /// get order id
        const orderId = req.params.orderId
        const userId = req.user._id
        const cancel = await orderService.orderCancel(userId, orderId)
        res.status(200).json({
            cancel
        })

    } catch (error) {
        next(error)
    }

}

const getOrderHistory = async (req, res, next) => { 
    
    try {

        const data = req.query
        const userId = req.user._id
        // console.log(data, userId)
        const orders = await orderService.customerOrderHistory(userId, data)

        res.status(200).json({
            success: true,
            orders
        })

    } catch (error) {
        next(error)
    }

}

const adminGetOrderById = async (req, res, next) => { 
    
    try {

        const orderId= req.params.id;
        const order = await orderService.getOrderById(orderId)

        res.status(200).json({
            success: true,
            data: {...order}
        })

    } catch (error) {
        next(error)
    }

}

const getOrderDetail = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const orderId = req.params.orderId;

        const order = await orderService.orderDetail(
            userId,
            orderId
        );

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        next(error);
    }
};

const updateOrderItemStatus = async (req, res, next) => {
    try {
        const vendorId = req.user._id;
        const { orderItemId, status } = req.body;

        const result = await orderService.updateOrderItemStatus(
            vendorId,
            orderItemId,
            status
        );

        res.status(200).json({
            success: true,
            message: "Order item status updated",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {

    try {

        const orders = await orderService.getAllOrders(req.query);

        res.status(200).json({
            success: true,
            ...orders
        });

    } catch (error) {
        next(error);
    }

};

const getOrdersByStatus = async (req, res, next) => {
    try {

        const { status } = req.query;

        const orders = await orderService.getOrdersByStatus(status);

        res.status(200).json({
            success: true,
            data: orders,
        });

    } catch (error) {
        next(error);
    }
};

const adminUpdateOrderStatus = async (req, res, next) => {
    try {

        const { orderId, status } = req.body;

        const updated = await orderService.adminUpdateOrderStatus(
            orderId,
            status
        );

        res.status(200).json({
            success: true,
            message: "Order status updated",
            data: updated,
        });

    } catch (error) {
        next(error);
    }
};

const customerInvoice= async (req, res, next) => {
    try {
        const pdf = await orderService.generateCustomerInvoice(
            req.params.orderId,
            req.user._id
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

        res.send(pdf);

    } catch (err) {
        next(err);
    }
}

const vendorInvoice= async (req, res, next) => {
    try {
        const pdf = await orderService.generateVendorInvoice(
            req.params.orderItemId,
            req.user._id
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=vendor-invoice.pdf");

        res.send(pdf);

    } catch (err) {
        next(err);
    }
}

const getVendorSalesSummary = async (req, res, next) => {
    try {

        const data = await orderService.getVendorSalesSummary(
            req.user._id,
            req.query
        );

        res.status(200).json({
            success: true,
            message: "Vendor sales summary fetched successfully.",
            data
        });

    } catch (err) {
        next(err);
    }
};

const getAdminSalesSummary = async (req, res, next) => {
    try {
        const data = await orderService.getAdminSalesSummary(req.query);
        
        res.status(200).json({
            success: true,
            message: "Vendor sales summary fetched successfully.",
            data,
        });
        } catch (err) {
        next(err);
    }
};

// Admin Sales Trend
const getAdminSalesTrend = async (req, res, next) => {
    try {
        const data = await orderService.getAdminSalesTrend(req.query);

        res.status(200).json({
            success: true,
            message: "Admin sales trend fetched successfully.",
            data,
        });
    } catch (err) {
        next(err);
    }
};

const getVendorSalesTrend = async (req, res, next) => {
    try {
        // console.log(req.user);
        const vendorId = req.user._id;

        const data = await orderService.getVendorSalesTrend(
            vendorId,
            req.query
        );

        res.status(200).json({
            success: true,
            message: "Vendor sales trend fetched successfully.",
            data,
        });

    } catch (err) {
        next(err);
    }
};

export {
    orderPlace, cancelOrder, getOrderHistory, adminGetOrderById, updateOrderItemStatus, getAllOrders, getAdminSalesTrend, getVendorSalesTrend,
    getOrdersByStatus, adminUpdateOrderStatus, getOrderDetail, customerInvoice, vendorInvoice, getVendorSalesSummary, getAdminSalesSummary
};

