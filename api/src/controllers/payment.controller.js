import StripeGateway from "../utils/StripePayment.js";
import PaymentService from "../services/payment.service.js";
import OrderModel from "../models/order.model.js";

/**
 * CREATE STRIPE SESSION
 */
export const createStripeSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payload = {
      amount: order.totalAmount * 100, // Stripe expects cents
      purchase_order_name: `Order ${order.orderNumber}`,
      purchase_order_id: String(order._id),
      customer_info: {
        email: req.user.email,
      },
      items: order.items,
    };

    const session = await StripeGateway.createCheckoutSession(payload);

    // create payment record (PENDING)
    await PaymentService.createStripePaymentRecord(order, session.sessionId);

    return res.status(200).json({
      success: true,
      message: "Stripe session created successfully",
      url: session.url,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.log("Stripe create session error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Stripe checkout session creation failed",
      error: error.message,
    });
  }
};

/**
 * VERIFY STRIPE PAYMENT
 * (called from frontend success page)
 */
export const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    // check Stripe session
    const result = await StripeGateway.verifyStripePayment(sessionId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // update DB payment + order
    const updated = await PaymentService.markPaymentSuccess({
      id: sessionId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: updated,
    });
  } catch (error) {
    console.log("Stripe verify error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
