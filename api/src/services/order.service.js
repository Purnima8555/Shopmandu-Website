import mongoose from "mongoose";
import client from "../config/redis.config.js";
import orderStatus from "../constants/orderStatus.js";
import { paymentMethod } from "../constants/paymentMethod.js";
import paymentStatus from "../constants/paymentStatus.js";
import OrderModel from "../models/Order.model.js";
import OrderItemsModel from "../models/OrderItem.model.js";
import PaymentModel from "../models/Payment.model.js";
import { AppError, BadRequestError, NotFoundError } from "../utils/AppError.js";
import { groupByVendorItems, calculateOrderTotals, calculateShipping, calculateTax, restoreProductStock } from "../utils/Order.utils.js";
import { generateUniqueOrderNumber } from "../utils/slug.utils.js";
import ProductModel from "../models/Product.model.js";
import { orderNotification, scheduleCodOrderConfirmation, scheduleUnpaidOrderCancellation } from "../utils/EmailQueue.js";
import { applyCouponService, markCouponAsUsedService } from "./coupon.service.js";


class OrderServices {


    //// place a new order from cart.
    async placeNewOrder(userId, cartData) {

        const session = await mongoose.startSession();
        let notifactionJobs = [];
        try {

            session.startTransaction();
            /// load and validate cart/stock
            const { vendorOrders, productReserve } = await groupByVendorItems(cartData.products)
            ////  reserve stock
            if (productReserve.length > 0) {
                const result = await ProductModel.bulkWrite(productReserve, { session });
                //   console.log(result)
                /// check if every items stock filter matched
                if (result.matchedCount !== productReserve.length) {
                    throw new BadRequestError("One or more items in your cart are no longer available in the requested quantity.");
                }
            }


            // console.dir(vendorOrders, { depth: null })
            /// calculate Total
            const grandTotal = calculateOrderTotals(vendorOrders)
            // console.log(grandTotal)

            /// shipping fee calculate
            const shippingFee = calculateShipping({ orderAmount: grandTotal.subTotal, weightKg: grandTotal.totalWeight, volumeCm3: grandTotal.totalVolume, zone: "local" });

            /// tax calculate
            const tax = calculateTax(grandTotal.subTotal)
            /// discount price calculate from copun
            let discount = 0
            let couponDiscount = {}
            let couponUsed;
            if(cartData?.couponCode){
                couponDiscount = await applyCouponService(userId, cartData.couponCode, grandTotal.subTotal)
                /// coupon mark as used 
                couponUsed = await markCouponAsUsedService(couponDiscount.coupon._id, userId)
            }



            console.log(couponUsed)
            
            if(couponUsed){
                discount = couponDiscount.discountAmount
            }

            // console.log(tax)
            const totalAmount = grandTotal.subTotal + shippingFee.totalShippingFee - discount;

            /// generate order number
            const orderNumber = await generateUniqueOrderNumber()
            const paymentId = new mongoose.Types.ObjectId();

            // console.log(totalAmount)
            // console.log(orderNumber)
            const items = Object.values(vendorOrders).map(item => (
                item.products
            )).flat()

            // console.log(items)


            /// create master order. with transactions
            ///  note: using create with an array and session returns an array of documents
            const [masterOrder] = await OrderModel.create([{
                customerId: userId,
                orderNumber,
                shippingAddress: { ...cartData.shippingAddress },
                //// product items.
                items: items,
                orderStatus: orderStatus.PENDING,
                subTotal: grandTotal.subTotal,
                discountAmount: discount || 0,
                shippingCharge: shippingFee.totalShippingFee,
                taxAmount: tax,
                totalAmount,
                paymentId,
                paymentStatus: paymentStatus.UNPAID,
                paymentMethod: cartData.paymentMethod || paymentMethod.CASH_ON_DELIVERY,
            }], { session })

            // console.log(masterOrder)
            /// payment setup with transactions

            // console.log(paymentId)
            const [payment] = await PaymentModel.create([{
                _id: paymentId,
                orderId: masterOrder._id,
                orderNumber,
                customerId: userId,
                amount: totalAmount,
                status: paymentStatus.PENDING,
                paymentMethod: cartData.paymentMethod || paymentMethod.CASH_ON_DELIVERY
            }], { session })


            //// create orderItems with transactions
            // console.log(payment)
            /// loop to generate all order items 
            const orderItemsArray = Object.values(vendorOrders).map(vendor => {
                const tax = calculateTax(vendor.totalPrice);
                return {
                    orderId: masterOrder._id,
                    vendorId: vendor.vendorId,
                    products: vendor.products,
                    totalPrice: vendor.totalPrice,
                    taxAmount: tax,
                    paymentStatus: paymentStatus.UNPAID,
                    orderItemsStatus: orderStatus.PENDING
                }
            })
            await OrderItemsModel.insertMany(orderItemsArray, { session });

            // masterOrder.paymentId = payment._id
            // await masterOrder.save({ session })

            await session.commitTransaction();


            /// checked if order is COD or ONLINE
            if (cartData.paymentMethod === paymentMethod.CASH_ON_DELIVERY) {
                scheduleCodOrderConfirmation(masterOrder._id)
            } else {
                scheduleUnpaidOrderCancellation(masterOrder._id)
            }
            return {
                success: true,
                masterOrder,
            };

        } catch (error) {
            await session.abortTransaction();
            throw new AppError(error.message || "Order creation failed.");
        } finally {
            await session.endSession()
        }

    }

    //// order history
    async customerOrderHistory(userId, data) {

        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const skip = (page - 1) * limit; // Number of items to skip
        const filter = { userId } 

        /// apply filter, paginated, get order with filter.
        if (data.paymentStatus) {
            filter.paymentStatus = data.paymentStatus
        }
        if (data.orderStatus) {
            filter.orderStatus = data.orderStatus
        }
        if (data.paymentMethod) {
            filter.paymentMethod = data.paymentMethod
        }

        const [orderData, totalDocuments] = await Promise.all([
            OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            OrderModel.countDocuments(filter)
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
            data: orderData
        }
    }

    /// pending unpade order get 
    async unpaidOrderGet(userId) {
        /// get unpade order
        const order = await OrderModel.find({
            customerId: userId,
            paymentStatus: paymentStatus.UNPAID,
            paymentMethod: paymentMethod.ONLINE,
            orderStatus: orderStatus.PENDING
        }).sort({ createAt: -1 }).lean()
        return order;
    }

    /// customer order detail
    async orderDetail(userId, orderId) {

        //// get order.
        const [order, orderItems] = await Promise.all([
            OrderModel.findOne({ _id: orderId,customerId: userId }).populate("paymentId").lean(),
            OrderItemsModel.find({
                orderId
            }).populate("vendorId", "userName")
                .populate({
                    path: "products.productId",
                    select: "productName slug images"
                }).lean()
            ]);

        if (!order) {
            throw new NotFoundError("Order not found.");
        }

        return {
            order,
            orderItems
        };
    }

    //// order cancels
    async orderCancel(userId, orderId) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            const userOrder = await OrderModel.findOneAndUpdate(
                { _id: orderId, customerId: userId, orderStatus: orderStatus.PENDING },
                {
                    $set: {
                        orderStatus: orderStatus.CANCELLED
                    }
                },
                {
                    returnDocument: "after",
                    session
                }
            );


            if (!userOrder) {
                throw new BadRequestError("Order cannot be cancelled anymore");
            }

            // restore stock
            await restoreProductStock(userOrder.items);

            // update vendor orders
            await OrderItemsModel.updateMany(
                { orderId: userOrder._id },
                { $set: { orderItemsStatus: orderStatus.CANCELLED } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return { message: "Order canceled successfully." };

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error
        }
    }

    //// get vendor all order 
    async getAllOrderByVendorId(vendorId, queryData) {

        const page = parseInt(queryData.page, 10) || 1
        const limit = parseInt(queryData.limit, 10) || 10
        const skip = (page - 1) * limit

        const filter = { vendorId };

        /// apply filter, paginated, get order with filter.
        if (queryData.paymentStatus) {
            filter.paymentStatus = queryData.paymentStatus
        }
        if (queryData.orderItemsStatus) {
            filter.orderItemsStatus = queryData.orderItemsStatus
        }

        const [orderData, totalDocuments] = await Promise.all([
            OrderItemsModel.find(filter).sort({ createAt: -1 }).skip(skip).limit(limit)
                .populate("orderId", "orderNumber").lean(),
            OrderItemsModel.countDocuments(filter)
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
            data: orderData
        }

    }

    //// admin get spacefic order by id
    async getOrderById(orderId) {

        const order = await OrderModel.findById(orderId)
            .populate("customerId", "userName email mobile")
            .populate("paymentId");

        if (!order) {
            throw new NotFoundError("Order not found.");
        }

        const orderItems = await OrderItemsModel.find({
            orderId: order._id
        })
            .populate("vendorId", "userName email")
            .populate({
                path: "products.productId",
                select: "productName slug images"
            });

        return {
            order,
            orderItems
        };
    }


}


export default new OrderServices();



