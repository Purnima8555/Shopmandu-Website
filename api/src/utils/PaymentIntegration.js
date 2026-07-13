import axios from "axios"
import config from "../config/config.js"
import Stripe from "stripe"
import { AppError, BadRequestError } from "./AppError.js"
import paymentGatewayConfig from "../config/paymentGatewayConfig.js"
import paymentStatus from "../constants/paymentStatus.js"
import OrderModel from "../models/Order.model.js"
import OrderItemsModel from "../models/OrderItem.model.js"
import orderStatus from "../constants/orderStatus.js"
import { paymentGateway } from "../constants/paymentMethod.js"


/// blueprint (parent ) payment class.
class PaymentGatewayNew {
    constructor(config, method) {
        this.config = config;
        this.method = method;
    }

    //// create payment session
    async createPayment() {
        throw new AppError("createPayment() must be implemented");
    }

    /// verify payment session
    async verifyPayment() {
        throw new AppError("verifyPayment() must be implemented");
    }

    /// normalize return for all getways
    normalize(response = {}) {
        return {
            success: response.success ?? true,
            method: response.method ?? null,
            transactionId: response.transactionId ?? null,
            paymentUrl: response.paymentUrl ?? null,
            message: response.message ?? null,
            data: response.data ?? null
        };
    }
}

//// pay with khalti class
class KhaltiGateway extends PaymentGatewayNew {

    constructor(config) {
        super(config, paymentGateway.KHALTI);
    }

    async createPayment(payload) {
        const { amount, purchase_order_id, purchase_order_name, customer_info, taxAmount } = payload;

        try {

            const payRequest = await axios.post(
                this.config.khalti_POST_uri,
                {
                    return_url: this.config.return_uri,
                    website_url: this.config.website_uri,
                    amount: amount + (taxAmount * 100),
                    purchase_order_id,
                    purchase_order_name,
                    customer_info
                },
                {
                    headers: {
                        Authorization: `Key ${this.config.khalti_secret_key}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            // console.log(payRequest.data)
            return this.normalize({
                success: true,
                method: this.method,
                transactionId: payRequest.data.pidx,
                paymentUrl: payRequest.data.payment_url,
                message: 'Payment URL generated successfully',
                data: payRequest.data,
            })

        } catch (error) {
            console.log(error.response?.data || error.message)
            return {
                success: false
            }
        }
    }

    async verifyPayment(paymentPayload) {
        const { pidx, transaction_id, total_amount } = paymentPayload
        // console.log(pidx, transaction_id)
        try {
            const verificationResponse = await axios.post(
                this.config.khalti_payment_lookup_uri,
                { pidx },
                {
                    headers: {
                        Authorization: `Key ${this.config.khalti_secret_key}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            const verifiedPayment = verificationResponse.data
            if (verifiedPayment.status === "Completed" && verifiedPayment.transaction_id === transaction_id) {
                return {
                    success: true,
                    message: "Payment verified successfully.",
                    data: verifiedPayment
                }
            }
            return {
                success: false,
                message: "Payment verification failed."
            }
        } catch (error) {
            console.log(error.response?.data || error.message)
            return {
                success: false,
                message: "Unable to verify Khalti payment."
            }

        }


    }
}

/// pay with stripe class
class StripeGateway extends PaymentGatewayNew {
    constructor(config) {
        super(config, paymentGateway.STRIPE);
        this.stripe = new Stripe(config.secret_key);
    }
    async createPayment(payload) {

        const line_items = payload.items.map(item => {
            return {
                price_data: {
                    currency: payload.currency || "npr",
                    product_data: {
                        name: item.productName || `Product ${item.productId}`,
                        images: item.images,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            }
        })

        // Shipping
        if (payload?.shippingAmount > 0) {
            line_items.push({
                price_data: {
                    currency: payload.currency || "npr",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: payload.shippingAmount * 100,
                },
                quantity: 1,
            });
        }
        if (payload?.taxAmount > 0) {
            line_items.push({
                price_data: {
                    currency: payload.currency || "npr",
                    product_data: {
                        name: "Tax",
                    },
                    unit_amount: payload.taxAmount * 100,
                },
                quantity: 1,
            });
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email: payload.customer_info?.email,
            success_url: this.config.success_url,
            cancel_url: this.config.cancel_url,

            metadata: {
                purchase_order_id: String(payload.purchase_order_id),
                shippingAmount: String(payload.shippingAmount || 0),
                taxAmount: String(payload.taxAmount || 0),
            },

        });

        return this.normalize({
            success: true,
            method: this.method,
            message: "Payment url generated successfully",
            transactionId: session.id,
            paymentUrl: session.url,
            data: {
                sessionId: session.id,
                amount: session.amount_total,
                currency: session.currency
            }
        });
    }

    async verifyPayment(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId)

            if (session.payment_status === "paid") {
                return {
                    success: true,
                    message: "Payment verified successfully.",
                    data: {
                        sessionId: session.id,
                        purchase_order_id: session.metadata.purchase_order_id,
                        amount: session.amount_total,
                        shippingAmount: session.metadata.shippingAmount,
                        taxAmount: session.metadata.taxAmount,
                        currency: session.currency,
                        customer_email: session.customer_details.email
                    }
                }
            }

            return {
                success: false,
                message: "Payment not completed."
            }

        } catch (error) {
            console.log(error.message)
            return {
                success: false,
                message: "Unable to verify Stripe payment."
            }
        }
    }
}

/// create instance of both gateways.
export const gateways = Object.freeze({
    stripe: new StripeGateway(paymentGatewayConfig.STRIPE),
    khalti: new KhaltiGateway(paymentGatewayConfig.KHALTI),
});

//// gateways get function 
export const getGateway = (method) => {
    const gateway = gateways[method.toLowerCase()]
    if (!gateway) {
        throw new BadRequestError(`unsupported payment geteway: ${method}`)
    }
    return gateway;
}

export const paymentVerificationHelper = async (session, paymentRecord, purchaseId, gateway) => {

    // Idempotency check
    if (paymentRecord.status === paymentStatus.PAID) {
        return {
            alreadyPaid: true
        }
    }


    ///  Update payment
    paymentRecord.status = paymentStatus.PAID;
    paymentRecord.gatewayTransactionId = purchaseId;
    paymentRecord.gateway = gateway;
    paymentRecord.paidAt = new Date();

    await paymentRecord.save({ session });

    /// Update order
    const order = await OrderModel.findByIdAndUpdate(
        paymentRecord.orderId,
        {
            paymentStatus: paymentStatus.PAID,
            orderStatus: orderStatus.CONFIRMED
        },
        {
            // new: true,
            returnDocument: "after",
            session
        }
    ).populate("customerId", "userName email");

    if (!order) {
        throw new NotFoundError("Order not found.");
    }

    ////  Update vendor orders
    await OrderItemsModel.updateMany(
        { orderId: order._id },
        {
            $set: {
                paymentStatus: paymentStatus.PAID,
                orderItemsStatus: orderStatus.CONFIRMED
            }
        },
        { session }
    );

    return order;
}

