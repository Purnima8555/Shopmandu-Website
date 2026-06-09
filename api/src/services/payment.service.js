import PaymentModel from "../models/payment.model.js";
import OrderModel from "../models/order.model.js";
import paymentStatus from "../constants/paymentStatus.js";
import paymentMethod from "../constants/paymentMethod.js";

class PaymentService {

    async createStripePaymentRecord(order, sessionId) {

        const payment = await PaymentModel.create({
            orderId: order._id,
            customerId: order.customerId,
            amount: order.totalAmount,
            gateway: paymentMethod.STRIPE,
            gatewayTransactionId: sessionId,
            status: paymentStatus.PENDING
        });

        return payment;
    }

    async markPaymentSuccess(session) {

        const payment = await PaymentModel.findOne({
            gatewayTransactionId: session.id
        });

        if (!payment) throw new Error("Payment record not found");

        payment.status = paymentStatus.PAID;
        payment.paidAt = new Date();
        await payment.save();

        const order = await OrderModel.findById(payment.orderId);

        order.paymentStatus = paymentStatus.PAID;
        order.orderStatus = "CONFIRMED";
        order.paidAt = new Date();

        await order.save();

        return { payment, order };
    }
}

export default new PaymentService();