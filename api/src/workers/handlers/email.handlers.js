import sendEmail from "../../messaging/email/email.service.js";
import crypto from "crypto";
import OrderModel from "../../models/Order.model.js";
import OrderItemsModel from "../../models/OrderItem.model.js";
import PaymentModel from "../../models/Payment.model.js";
import UserModel from "../../models/user.model.js";

import { ResetPasswordEmailbody } from "../../messaging/email/templates/resetPassword.template.js";
import { orderEmailForSeller } from "../../messaging/email/templates/vendorNewOrder.template.js";
import { orderConfirmationEmail } from "../../messaging/email/templates/orderConfirmation.template.js";


import { notifyVendor, restoreProductStock } from "../../utils/Order.utils.js";
import { orderConfermationNotifaction } from "../../utils/EmailQueue.js";
import orderStatus from "../../constants/orderStatus.js";
import paymentStatus from "../../constants/paymentStatus.js";
import ResetForgetPassword from "../../models/ResetForgerPassword.models.js";


export const emailHandlers = {
  ///// send email job resolver
  "send-email": async function sendMail(job) {
    await sendEmail(job.data.to, job.data.subject, job.data.body);
  },

  //// generate reset password link and send email.
  "reset-password-email": async function resetPassword(job) {

    // const body = decrypt(job.data.body);
    /// get token from database and send to the user
    const user = await ResetForgetPassword.findOne({ userId: job.data.userId });

    const hashToken = crypto.createHash("sha256").update(user.token).digest("hex");
    const link = `${process.env.CLIENT_URL}/reset-password/?id=${user.userId}&token=${hashToken}`;
    const body = ResetPasswordEmailbody(link);

    /// send reset password link email
    await sendEmail(job.data.to, "Reset Password", body);
  },

  ///// When new order conform then notify vendor.
  "orderNotifaction": async function orderNotification(job) {

    /// email body create
    const body = orderEmailForSeller(job.data);

    /// send email
    await sendEmail(job.data.vendorEmail, `New Order ${job.data.orderNumber}`, body);
  },


  //// after a few minutes place the COD order confirm  and queue the email notification job
  "cod-order-confirmation": async function codOrderConfirmation(job) {

    /// get order with update unpaid and confirmed.
    const order = await OrderModel.findOneAndUpdate(
      { _id: job.data.orderId, orderStatus: orderStatus.PENDING },
      {
        $set: {
          orderStatus: orderStatus.CONFIRMED,
          paymentStatus: paymentStatus.UNPAID
        }
      },
      {
        // new: true
        returnDocument: "after"
      }
    ).populate("customerId", "userName email");

    /// when order not found and come, safely return
    if (!order) return;

    /// when order are update then also all orderItem update.
    await OrderItemsModel.updateMany(
      { orderId: order._id },
      {
        $set: {
          orderItemsStatus: orderStatus.CONFIRMED,
          paymentStatus: paymentStatus.UNPAID
        }
      }
    );

    /// get commondata for email notifaction and job add.
    const commonData = {
      orderNumber: order.orderNumber,
      shippingAddress: order.shippingAddress.toObject()
    };

    /// notify vendor
    await notifyVendor(order, commonData);

    // notify customer 
    await orderConfermationNotifaction(order);
  },


  //// automatically cancel the payment if the order is not paid within the allowed time
  "cancel-unpaid-order": async function cancelUnpaidOrder(job) {

    /// update order when payment time is expired
    const order = await OrderModel.findOneAndUpdate(
      { _id: job.data.orderId, orderStatus: orderStatus.PENDING },
      {
        $set: {
          orderStatus: orderStatus.CANCELLED,
          paymentStatus: paymentStatus.EXPIRED
        }
      },
      { returnDocument: "after" }
    );

    /// return when order not found or not update
    if (!order) return;

    /// restore product that reserved products.
    await restoreProductStock(order.items);

    /// update all vendor order expired and cancelled
    await OrderItemsModel.updateMany(
      { orderId: order._id },
      {
        $set: {
          orderItemsStatus: orderStatus.CANCELLED,
          paymentStatus: paymentStatus.EXPIRED
        }
      }
    );

    /// update payment
    await PaymentModel.updateOne(
      { orderId: order._id },
      { $set: { status: paymentStatus.EXPIRED } }
    );

  },

  //// notify the customer when the order is confirmed
  "order-confirmation-notifaction": async function orderConfirmation(job) {
    /// get email body

    // console.log(job)
    const body = orderConfirmationEmail(job.data);

    /// send email when order conformed
    await sendEmail(job.data.email,`Order ${job.data.orderNumber} Confirmed`,body);
  }
};


