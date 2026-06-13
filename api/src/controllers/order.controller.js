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
        { EX: 10, NX: true });

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
        console.log(data, userId)
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

export  {orderPlace,cancelOrder,getOrderHistory, adminGetOrderById};

