

import mongoose from "mongoose";
import orderStatus from "../constants/orderStatus.js";
import { paymentGateway, paymentMethod } from "../constants/paymentMethod.js";
import paymentStatus from "../constants/paymentStatus.js";
import OrderModel from "../models/Order.model.js";
import OrderItemsModel from "../models/OrderItem.model.js";
import PaymentModel from "../models/Payment.model.js";
import { BadRequestError, NotFoundError } from "../utils/AppError.js";
import { orderConfermationNotifaction, orderNotification, removeOrderCancellationJob } from "../utils/EmailQueue.js";
import { getGateway, paymentVerificationHelper } from "../utils/PaymentIntegration.js";
import { notifyVendor } from "../utils/Order.utils.js";



class PaymentService {


    async orderPay(userId, orderid, gateway) {

        /// get that order payment record.

        const orderPayment = await PaymentModel.findOne({ customerId: userId, orderId: orderid, paymentMethod: paymentMethod.ONLINE }).populate("customerId", 'userName email mobile').populate("orderId", "orderNumber items shippingCharge taxAmount")

        if (!orderPayment) {
            throw new NotFoundError("Order Payment Status Not Found.");
        }

        if (orderPayment.status === paymentStatus.EXPIRED || orderPayment.status === orderStatus.CANCELLED) {
            throw new BadRequestError("Your order payment time already expired.");
        }
        if (orderPayment.status === paymentStatus.PAID) {
            throw new BadRequestError("Order alrady pay.")
        }

        let orderNumber = orderPayment.orderId.orderNumber.toString()
        let amount = orderPayment.amount * 100
        //// create payload for payment.
        const paymentPayload = {
            amount,
            purchase_order_id: orderNumber,
            purchase_order_name: `Order with ${orderPayment.orderId.items.length} items`,  /// i dont know what value i am add  here.
            items: orderPayment.orderId.items,
            shippingAmount: orderPayment.orderId.shippingCharge,
            taxAmount: orderPayment.orderId.taxAmount,
            customer_info: {
                name: orderPayment.customerId.userName,
                email: orderPayment.customerId.email,
                phone: orderPayment.customerId.mobile
            }
        }

        // console.log(paymentPayload)

        const gatewayInstance = getGateway(gateway)
        const payment = await gatewayInstance.createPayment(paymentPayload)
        return payment
    }

    //// verify order payment for Khalti
    async verifyOrderPayment(pidx, transaction_id, total_amount, purchase_order_id) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const khalti = getGateway(paymentGateway.KHALTI)
            const isVerify = await khalti.verifyPayment({
                pidx,
                transaction_id,
                total_amount
            });
            //// verify with Khalti 
            // const isVerify = await payment.verifyKhaltiPayment({
            //     pidx,
            //     transaction_id,
            //     total_amount
            // });

            if (!isVerify.success) {
                throw new BadRequestError("Payment verification failed.");
            }

            //// Get payment + related order in ONE query 
            const paymentRecord = await PaymentModel.findOne({
                orderNumber: purchase_order_id
            }).session(session)

            if (!paymentRecord) {
                throw new NotFoundError("Payment record not found.");
            }
            const order = await paymentVerificationHelper(session, paymentRecord, transaction_id, paymentGateway.KHALTI)
            if (order.alreadyPaid) {
                await session.commitTransaction();
                return {
                    success: true,
                    message: "Payment already verified."
                };
            }

            await session.commitTransaction();

            ////  Remove cancel job 
            await removeOrderCancellationJob(order._id.toString());

            const commonData = {
                template: "New Order",
                orderNumber: order.orderNumber,
                shippingAddress: order.shippingAddress
            };

            /// notify vendor/ add email job
            await notifyVendor(order, commonData);

            /// send email for costumer order is conform and paid.
            await orderConfermationNotifaction(order)
            return {
                success: true,
                message: "Payment verified successfully."
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async verifyStripePayment(sessionId) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const stripe = getGateway(paymentGateway.STRIPE)
            const isVerify = await stripe.verifyPayment(sessionId);

            if (!isVerify.success) {
                throw new BadRequestError("Stripe payment verification failed.");
            }

            const paymentRecord = await PaymentModel.findOne({
                orderNumber: isVerify.data.purchase_order_id
            }).session(session);

            if (!paymentRecord) {
                throw new NotFoundError("Payment record not found.");
            }

            const order = await paymentVerificationHelper(session, paymentRecord, sessionId, paymentGateway.STRIPE)

            if (order.alreadyPaid) {
                await session.commitTransaction();
                return {
                    success: true,
                    message: "Payment already verified."
                };
            }

            await session.commitTransaction();

            await removeOrderCancellationJob(order._id.toString());

            const commonData = {
                template: "New Order",
                orderNumber: order.orderNumber,
                shippingAddress: order.shippingAddress
            };

            await notifyVendor(order, commonData);
            await orderConfermationNotifaction(order);

            return {
                success: true,
                message: "Stripe payment verified successfully."
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    //// customer payment history
    async paymentHistory(userId, data) {
        /// filter and pagination

        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const filter = { customerId: userId };

        /// filer by gatway
        if (data.gateway) {
            filter.gateway = data.gateway.toString().toUpperCase()
        }
        if (data.paymentMethod) {
            filter.paymentMethod = data.paymentMethod.toString().toUpperCase()
        }

        if (data.status) {
            filter.status = data.status.toString().toUpperCase()
        }

        const [paymentData, totalDocuments] = await Promise.all([
            PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().populate("orderId", "items orderStatus"),
            PaymentModel.countDocuments(filter)
        ])
        const totalPages = Math.ceil(totalDocuments / limit)

        return {
            metadata: {
                totalResults: totalDocuments,
                totalPages: totalPages,
                currentPage: page,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: paymentData
        }
    }

    /// get payment by Id
    async paymentById(userId, paymentId) {
        const payment = await PaymentModel.findOne({
            _id: paymentId,
            customerId: userId
        }).lean();
        if (!payment) {
            throw new NotFoundError("Payment not found.");
        }
        return payment;
    }

    //// get all payment for admin
    async getPayments(query) {

        //// filter and pagination
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(Number(query.limit) || 10, 100);
        const skip = (page - 1) * limit;

        const filter = {};

        if (query.gateway) {
            filter.gateway = query.gateway.toString().toUpperCase()
        }
        if (query.paymentMethod) {
            filter.paymentMethod = query.paymentMethod.toString().toUpperCase()
        }

        if (query.search?.trim()) {
            filter.orderNumber = {
                $regex: query.search.trim(),
                $options: "i",
            };
        }

        if (query.status) {
            filter.status = query.status.toString().toUpperCase()
        }

        /// get payment and total document with filter and pagination
        const [payments, totalDocuments] = await Promise.all([
            PaymentModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
                .populate("customerId", "name email")
                .populate("orderId", "orderNumber orderStatus totalAmount")
                .lean(),
            PaymentModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalDocuments / limit);

        return {
            metadata: {
                totalResults: totalDocuments,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: payments
        };
    }


    /// request for refund

}


export default new PaymentService();