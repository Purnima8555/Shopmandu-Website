
import config from "../config/config.js"
import paymentService from "../services/payment.service.js"
import { getWishlist } from "./wishlist.controller.js"



const payOrder = async (req, res, next) => {

    try {

        const userId = req.user._id
        const { orderId, gateway } = req.body

        const paymentOrder = await paymentService.orderPay(userId, orderId, gateway);
        res.status(200).json(paymentOrder)
    } catch (error) {
        next(error)
    }

}


const paymentCheckOut = async (req, res, next) => {
    try {
        const { pidx, transaction_id, tidx, txnId, amount, total_amount, mobile, status, purchase_order_id, purchase_order_name } = req.query
        // console.log({ pidx, transaction_id, tidx, txnId, amount, total_amount, mobile, status, purchase_order_id, purchase_order_name })
        const verifyPayment = await paymentService.verifyOrderPayment(pidx, transaction_id, total_amount, purchase_order_id)

        return res.redirect(
            `${config.client_url}/payment/success/${purchase_order_id}`
        );
    } catch (error) {
        return res.redirect(`${config.client_url}/payment/failed/${purchase_order_id}`);
        // next(error)
    }
}

// STRIPE PAYMENT CHECKOUT (VERIFY)
const verifyStripeCheckout = async (req, res, next) => {
    try {
        const sessionId = req.query.session_id;
        // console.log(sessionId)
        const verifyPayment = await paymentService.verifyStripePayment(sessionId);

        return res.redirect(
            `${config.client_url}/payment/success/${verifyPayment.orderNumber}`
        );


    } catch (error) {
        return res.redirect(`${config.client_url}/payment/failed/${verifyPayment.orderNumber}`);
        // next(error);
    }
};


/// get my payment history

const getMyPaymentHistory = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const data = req.query;

        const payments = await paymentService.paymentHistory(userId, data)

        res.status(200).json({
            success: true,
            payments

        })

    } catch (error) {
        next(error)
    }
}

/// get payment by id

const getPaymentById = async (req, res, next) => {
    try {

        const payment = await paymentService.paymentById(req.user._id, req.params.id)
        res.status(200).json({
            success: true,
            payment
        })

    } catch (error) {
        next(error)
    }
}

/// get payment for admin
const getAllPayments = async (req, res, next) => {

    try {

        const payments = await paymentService.getPayments(req.query);

        res.status(200).json({
            success: true,
            payments
        })


    } catch (error) {
        next(error)
    }

}


export { payOrder, paymentCheckOut, getMyPaymentHistory, getPaymentById, getAllPayments, verifyStripeCheckout }
