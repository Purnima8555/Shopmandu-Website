
import paymentService from "../services/payment.service.js"
import { getWishlist } from "./wishlist.controller.js"



const payOrder = async (req, res, next) => {

    try {

        const userId = req.user._id
        const { orderId, gateway } = req.body

        const paymentOrder = await paymentService.orderPay(userId, orderId, gateway)
        res.status(200).json({
            paymentOrder
        })
    } catch (error) {
        next(error)
    }

}


const paymentCheckOut = async (req, res, next)=>{
    try {
        const { pidx, transaction_id, tidx, txnId, amount, total_amount, mobile, status, purchase_order_id, purchase_order_name } = req.query
        // console.log({ pidx, transaction_id, tidx, txnId, amount, total_amount, mobile, status, purchase_order_id, purchase_order_name })
        const verifyPayment = await paymentService.verifyOrderPayment(pidx, transaction_id, total_amount, purchase_order_id)
        res.status(200).json({ verifyPayment })
    } catch (error) {
        next(error)
    }
}

/// get my payment history

const getMyPaymentHistory= async (req, res, next)=>{

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

const getPaymentById = async (req, res, next) =>{
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


export { payOrder, paymentCheckOut, getMyPaymentHistory, getPaymentById, getAllPayments }
