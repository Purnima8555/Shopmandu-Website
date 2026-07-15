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
import puppeteer from "puppeteer";
import { QR } from "../utils/qr.generator.js";
import { customerInvoiceTemplate } from "../messaging/email/templates/customerInvoice.template.js";
import { vendorInvoiceTemplate } from "../messaging/email/templates/vendorInvoice.template.js";
import ReturnRequestModel from "../models/ReturnRequest.model.js";
import buildDateFilter from "../utils/dateFilter.js";

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

            let subTotal = 0;

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
            if (cartData?.couponCode) {
                couponDiscount = await applyCouponService(userId, cartData.couponCode, grandTotal.subTotal)
                /// coupon mark as used 
                couponUsed = await markCouponAsUsedService(couponDiscount.coupon._id, userId)
            }



            console.log(couponUsed)

            if (couponUsed) {
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
            const filter = { customerId: userId };

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

        // Get order and items
        const [order, orderItems] = await Promise.all([
            OrderModel.findOne({
                _id: orderId,
                customerId: userId,
            })
                .populate("paymentId")
                .lean(),

            OrderItemsModel.find({
                orderId,
            })
                .populate("vendorId", "userName")
                .populate({
                    path: "products.productId",
                    select: "productName slug images",
                })
                .lean(),
        ]);

        if (!order) {
            throw new NotFoundError("Order not found.");
        }

        // Fetch every return request belonging to this order
        const returnRequests = await ReturnRequestModel.find({
            orderId,
        }).lean();

        // Attach return request information to every product
        const updatedOrderItems = orderItems.map((orderItem) => {

            const products = orderItem.products.map((product) => {

                const request = returnRequests.find((item) =>
                    item.orderItemId.toString() === orderItem._id.toString() &&
                    item.productId.toString() === product.productId._id.toString()
                );

                return {
                    ...product,

                    hasReturnRequest: !!request,

                    returnRequest: request
                        ? {
                            _id: request._id,
                            status: request.status,
                            quantity: request.quantity,
                            reason: request.reason,
                            createdAt: request.createdAt,
                        }
                        : null,
                };
            });

            return {
                ...orderItem,
                products,
            };
        });

        return {
            order,
            orderItems: updatedOrderItems,
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
        const page = parseInt(queryData.page, 10) || 1;
        const limit = parseInt(queryData.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const pipeline = [];

        /// Filter by Vendor
        pipeline.push({ $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } });

        //// Filter by Status (If provided)
        if (queryData.orderItemsStatus) {
            pipeline.push({ $match: { orderItemsStatus: queryData.orderItemsStatus } });
        }

        //// Lookup Order details so we can search by orderNumber
        pipeline.push({
            $lookup: {
                from: "orders", // collection name in mongodb
                localField: "orderId",
                foreignField: "_id",
                as: "orderId"
            }
        });

        // Unwind because lookup returns an array
        pipeline.push({ $unwind: "$orderId" });

        // // Global Search (Search by Product Name or Order Number)
        if (queryData.search) {
            const searchRegex = new RegExp(queryData.search, "i");
            pipeline.push({
                $match: {
                    $or: [
                        { "orderId.orderNumber": searchRegex },
                        { "products.productName": searchRegex }
                    ]
                }
            });
        }

        // // Facet for Metadata and Data (Handles count and pagination in one call)
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ]
            }
        });

        const result = await OrderItemsModel.aggregate(pipeline);

        const totalDocuments = result[0].metadata[0]?.total || 0;
        const orderData = result[0].data;
        const totalPages = Math.ceil(totalDocuments / limit);

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
        };
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

    // vendor status update and automatically update master
    async updateOrderItemStatus(vendorId, orderItemId, status) {

        const allowed = [
            orderStatus.PROCESSING,
            orderStatus.OUT_FOR_DELIVERY,
            orderStatus.DELIVERED,
            orderStatus.CANCELLED
        ];

        if (!allowed.includes(status)) {
            throw new BadRequestError("Invalid status update");
        }

        const now = new Date();
        const update = {
            orderItemsStatus: status
        };

        if (status === orderStatus.PROCESSING) update.processedAt = now;
        if (status === orderStatus.OUT_FOR_DELIVERY) update.shippedAt = now;
        if (status === orderStatus.DELIVERED) update.deliveredAt = now;

        const orderItem = await OrderItemsModel.findOneAndUpdate(
            { _id: orderItemId, vendorId },
            { $set: update },
            { new: true }
        );

        if (!orderItem) {
            throw new NotFoundError("Order item not found");
        }

        const items = await OrderItemsModel.find({
            orderId: orderItem.orderId
        });

        const statuses = items.map(i => i.orderItemsStatus);

        const masterStatus =
            statuses.every(s => s === orderStatus.DELIVERED)
                ? orderStatus.DELIVERED
            : statuses.every(s => s === orderStatus.CANCELLED)
                ? orderStatus.CANCELLED
            : statuses.some(s => s === orderStatus.OUT_FOR_DELIVERY)
                ? orderStatus.OUT_FOR_DELIVERY
            : statuses.some(s => s === orderStatus.PROCESSING)
                ? orderStatus.PROCESSING
            : orderStatus.PARTIALLY_SHIPPED;

        await OrderModel.findByIdAndUpdate(orderItem.orderId, {
            orderStatus: masterStatus
        });

        return orderItem;
    }

    /// admin getAllOrders with filter
    async getAllOrders(queryData) {

        const page = parseInt(queryData.page, 10) || 1;
        const limit = parseInt(queryData.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (queryData.orderStatus) {
            filter.orderStatus = queryData.orderStatus;
        }

        if (queryData.paymentStatus) {
            filter.paymentStatus = queryData.paymentStatus;
        }

        if (queryData.paymentMethod) {
            filter.paymentMethod = queryData.paymentMethod;
        }

        const [orders, totalDocuments] = await Promise.all([

            OrderModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("customerId", "userName email")
                .lean(),

            OrderModel.countDocuments(filter)

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

            data: orders
        };
    }

    // admin stausUpdate
    async adminUpdateOrderStatus(orderId, status) {

        const ADMIN_ALLOWED_STATUSES = [
            orderStatus.PROCESSING,
            orderStatus.OUT_FOR_DELIVERY,
            orderStatus.DELIVERED,
            orderStatus.RETURNED,
        ];

        const order = await OrderModel.findById(orderId);
        if (!order) throw new NotFoundError("Order not found");

        // block statuses
        if (!ADMIN_ALLOWED_STATUSES.includes(status)) {
            throw new BadRequestError(
                `Admin cannot manually set status to ${status}`
            );
        }

        order.orderStatus = status;

        if (status === "PROCESSING") order.deliveredAt = new Date();
        if (status === "DELIVERED") order.deliveredAt = new Date();
        if (status === "OUT_FOR_DELIVERY") order.shippedAt = new Date();
        if (status === "RETURNED") order.returnedAt = new Date();

        await order.save();
        return order;
    }

    /// cusotmer invoice
    async generateCustomerInvoice(orderId, userId) {

        const order = await OrderModel.findOne({
            _id: orderId,
            customerId: userId
        }).lean();

        if (!order) throw new NotFoundError("Order not found");

        const qr = await QR(
            `${order.orderNumber}`
        );

        const html = customerInvoiceTemplate({
            orderNumber: order.orderNumber,
            customerName: "Customer",
            orderStatus: order.orderStatus,
            items: order.items,
            totalAmount: order.totalAmount,
            qr
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        return pdf;
    }

    async generateVendorInvoice(orderItemId, vendorId) {

        const orderItem = await OrderItemsModel.findOne({
            _id: orderItemId,
            vendorId
        }).lean();

        if (!orderItem) throw new NotFoundError("Order item not found");

        const qr = await QR(
            `${orderItemId}`
        );

        const html = vendorInvoiceTemplate({
            orderItemId,
            vendorName: "Vendor",
            products: orderItem.products,
            totalPrice: orderItem.totalPrice,
            qr
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();
        return pdf;
    }

    /// vendor dashboard sales summary
    async getVendorSalesSummary(vendorId, query = {}) {
        const { filter: dateFilter, period } = buildDateFilter(query);
        const [orders, refundedRequests] = await Promise.all([

            OrderItemsModel.find({
                vendorId,
                ...dateFilter
            }).lean(),

            ReturnRequestModel.find({
                vendorId,
                status: "REFUNDED",
                ...dateFilter
            }).lean()

        ]);

        let totalRevenue = 0;

        const summary = {
            totalOrders: orders.length,
            pendingOrders: 0,
            confirmedOrders: 0,
            processingOrders: 0,
            partiallyShippedOrders: 0,
            outForDeliveryOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        for (const order of orders) {

            switch (order.orderItemsStatus) {

                case orderStatus.PENDING:
                    summary.pendingOrders++;
                    break;

                case orderStatus.CONFIRMED:
                    summary.confirmedOrders++;
                    break;

                case orderStatus.PROCESSING:
                    summary.processingOrders++;
                    break;

                case orderStatus.PARTIALLY_SHIPPED:
                    summary.partiallyShippedOrders++;
                    break;

                case orderStatus.OUT_FOR_DELIVERY:
                    summary.outForDeliveryOrders++;
                    break;

                case orderStatus.DELIVERED:
                    summary.deliveredOrders++;
                    totalRevenue += order.totalPrice;
                    break;

                case orderStatus.CANCELLED:
                    summary.cancelledOrders++;
                    break;
            }
        }

        for (const refund of refundedRequests) {
            totalRevenue -= refund.refundAmount;
        }

        return {
            period,
            ...summary,
            totalRevenue,
            averageOrderValue:
                summary.deliveredOrders > 0
                    ? Number((totalRevenue / summary.deliveredOrders).toFixed(2))
                    : 0
        };
    }

    /// admin dashboard sales summary
    async getAdminSalesSummary(query = {}) {

        const { filter: dateFilter, period } = buildDateFilter(query);

        const [orders, refundedRequests] = await Promise.all([

            OrderModel.find(dateFilter).lean(),

            ReturnRequestModel.find({
                status: "REFUNDED",
                ...dateFilter
            }).lean()

        ]);

        let grossSales = 0;

        const summary = {
            totalOrders: orders.length,
            pendingOrders: 0,
            confirmedOrders: 0,
            processingOrders: 0,
            partiallyShippedOrders: 0,
            outForDeliveryOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        for (const order of orders) {

            switch (order.orderStatus) {

                case orderStatus.PENDING:
                    summary.pendingOrders++;
                    break;

                case orderStatus.CONFIRMED:
                    summary.confirmedOrders++;
                    break;

                case orderStatus.PROCESSING:
                    summary.processingOrders++;
                    break;

                case orderStatus.PARTIALLY_SHIPPED:
                    summary.partiallyShippedOrders++;
                    break;

                case orderStatus.OUT_FOR_DELIVERY:
                    summary.outForDeliveryOrders++;
                    break;

                case orderStatus.DELIVERED:
                    summary.deliveredOrders++;
                    grossSales += order.totalAmount;
                    break;

                case orderStatus.CANCELLED:
                    summary.cancelledOrders++;
                    break;
            }
        }

        for (const refund of refundedRequests) {
            grossSales -= refund.refundAmount;
        }

        return {
            period,
            ...summary,
            grossSales,
            averageOrderValue:
                summary.deliveredOrders > 0
                    ? Number((grossSales / summary.deliveredOrders).toFixed(2))
                    : 0
        };
    }

    // vendor status update and automatically update master
    async updateOrderItemStatus(vendorId, orderItemId, status) {

        const allowed = [
            orderStatus.PROCESSING,
            orderStatus.OUT_FOR_DELIVERY,
            orderStatus.DELIVERED,
            orderStatus.CANCELLED
        ];

        if (!allowed.includes(status)) {
            throw new BadRequestError("Invalid status update");
        }

        const now = new Date();
        const update = {
            orderItemsStatus: status
        };

        if (status === orderStatus.PROCESSING) update.processedAt = now;
        if (status === orderStatus.OUT_FOR_DELIVERY) update.shippedAt = now;
        if (status === orderStatus.DELIVERED) update.deliveredAt = now;

        const orderItem = await OrderItemsModel.findOneAndUpdate(
            { _id: orderItemId, vendorId },
            { $set: update },
            { new: true }
        );

        if (!orderItem) {
            throw new NotFoundError("Order item not found");
        }

        const items = await OrderItemsModel.find({
            orderId: orderItem.orderId
        });

        const statuses = items.map(i => i.orderItemsStatus);

        const masterStatus =
            statuses.every(s => s === orderStatus.DELIVERED)
                ? orderStatus.DELIVERED
                : statuses.every(s => s === orderStatus.CANCELLED)
                    ? orderStatus.CANCELLED
                    : statuses.some(s => s === orderStatus.OUT_FOR_DELIVERY)
                        ? orderStatus.OUT_FOR_DELIVERY
                        : statuses.some(s => s === orderStatus.PROCESSING)
                            ? orderStatus.PROCESSING
                            : orderStatus.PARTIALLY_SHIPPED;

        await OrderModel.findByIdAndUpdate(orderItem.orderId, {
            orderStatus: masterStatus
        });

        return orderItem;
    }

    /// admin getAllOrders with filter
    async getAllOrders(queryData) {

        const page = parseInt(queryData.page, 10) || 1;
        const limit = parseInt(queryData.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (queryData.orderStatus) {
            filter.orderStatus = queryData.orderStatus;
        }

        if (queryData.paymentStatus) {
            filter.paymentStatus = queryData.paymentStatus;
        }

        if (queryData.search?.trim()) {
            filter.orderNumber = {
                $regex: queryData.search.trim(),
                $options: "i",
            };
        }

        if (queryData.paymentMethod) {
            filter.paymentMethod = queryData.paymentMethod;
        }

        const [orders, totalDocuments] = await Promise.all([

            OrderModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("customerId", "userName email")
                .lean(),

            OrderModel.countDocuments(filter)

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

            data: orders
        };
    }

    // admin stausUpdate
    async adminUpdateOrderStatus(orderId, status) {

        const ADMIN_ALLOWED_STATUSES = [
            orderStatus.PROCESSING,
            orderStatus.OUT_FOR_DELIVERY,
            orderStatus.DELIVERED,
            orderStatus.RETURNED,
        ];

        const order = await OrderModel.findById(orderId);
        if (!order) throw new NotFoundError("Order not found");

        // block statuses
        if (!ADMIN_ALLOWED_STATUSES.includes(status)) {
            throw new BadRequestError(
                `Admin cannot manually set status to ${status}`
            );
        }

        order.orderStatus = status;

        if (status === "PROCESSING") order.deliveredAt = new Date();
        if (status === "DELIVERED") order.deliveredAt = new Date();
        if (status === "OUT_FOR_DELIVERY") order.shippedAt = new Date();
        if (status === "RETURNED") order.returnedAt = new Date();

        await order.save();
        return order;
    }

    /// cusotmer invoice
    async generateCustomerInvoice(orderId, userId) {

        const order = await OrderModel.findOne({
            _id: orderId,
            customerId: userId
        }).lean();

        if (!order) throw new NotFoundError("Order not found");

        const qr = await QR(
            `${order.orderNumber}`
        );

        const html = customerInvoiceTemplate({
            orderNumber: order.orderNumber,
            customerName: "Customer",
            orderStatus: order.orderStatus,
            items: order.items,
            totalAmount: order.totalAmount,
            qr
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        return pdf;
    }

    async generateVendorInvoice(orderItemId, vendorId) {

        const orderItem = await OrderItemsModel.findOne({
            _id: orderItemId,
            vendorId
        }).lean();

        if (!orderItem) throw new NotFoundError("Order item not found");

        const qr = await QR(
            `${orderItemId}`
        );

        const html = vendorInvoiceTemplate({
            orderItemId,
            vendorName: "Vendor",
            products: orderItem.products,
            totalPrice: orderItem.totalPrice,
            qr
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();
        return pdf;
    }

    /// vendor dashboard sales summary
    async getVendorSalesSummary(vendorId, query = {}) {
        const { filter: dateFilter, period } = buildDateFilter(query);
        const [orders, refundedRequests] = await Promise.all([

            OrderItemsModel.find({
                vendorId,
                ...dateFilter
            }).lean(),

            ReturnRequestModel.find({
                vendorId,
                status: "REFUNDED",
                ...dateFilter
            }).lean()

        ]);

        let totalRevenue = 0;

        const summary = {
            totalOrders: orders.length,
            pendingOrders: 0,
            confirmedOrders: 0,
            processingOrders: 0,
            partiallyShippedOrders: 0,
            outForDeliveryOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        for (const order of orders) {

            switch (order.orderItemsStatus) {

                case orderStatus.PENDING:
                    summary.pendingOrders++;
                    break;

                case orderStatus.CONFIRMED:
                    summary.confirmedOrders++;
                    break;

                case orderStatus.PROCESSING:
                    summary.processingOrders++;
                    break;

                case orderStatus.PARTIALLY_SHIPPED:
                    summary.partiallyShippedOrders++;
                    break;

                case orderStatus.OUT_FOR_DELIVERY:
                    summary.outForDeliveryOrders++;
                    break;

                case orderStatus.DELIVERED:
                    summary.deliveredOrders++;
                    totalRevenue += order.totalPrice;
                    break;

                case orderStatus.CANCELLED:
                    summary.cancelledOrders++;
                    break;
            }
        }

        for (const refund of refundedRequests) {
            totalRevenue -= refund.refundAmount;
        }

        return {
            period,
            ...summary,
            totalRevenue,
            averageOrderValue:
                summary.deliveredOrders > 0
                    ? Number((totalRevenue / summary.deliveredOrders).toFixed(2))
                    : 0
        };
    }

    /// admin dashboard sales summary
    async getAdminSalesSummary(query = {}) {

        const { filter: dateFilter, period } = buildDateFilter(query);

        const [orders, refundedRequests] = await Promise.all([

            OrderModel.find(dateFilter).lean(),

            ReturnRequestModel.find({
                status: "REFUNDED",
                ...dateFilter
            }).lean()

        ]);

        let grossSales = 0;

        const summary = {
            totalOrders: orders.length,
            pendingOrders: 0,
            confirmedOrders: 0,
            processingOrders: 0,
            partiallyShippedOrders: 0,
            outForDeliveryOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0
        };

        for (const order of orders) {

            switch (order.orderStatus) {

                case orderStatus.PENDING:
                    summary.pendingOrders++;
                    break;

                case orderStatus.CONFIRMED:
                    summary.confirmedOrders++;
                    break;

                case orderStatus.PROCESSING:
                    summary.processingOrders++;
                    break;

                case orderStatus.PARTIALLY_SHIPPED:
                    summary.partiallyShippedOrders++;
                    break;

                case orderStatus.OUT_FOR_DELIVERY:
                    summary.outForDeliveryOrders++;
                    break;

                case orderStatus.DELIVERED:
                    summary.deliveredOrders++;
                    grossSales += order.totalAmount;
                    break;

                case orderStatus.CANCELLED:
                    summary.cancelledOrders++;
                    break;
            }
        }

        for (const refund of refundedRequests) {
            grossSales -= refund.refundAmount;
        }

        return {
            period,
            ...summary,
            grossSales,
            averageOrderValue:
                summary.deliveredOrders > 0
                    ? Number((grossSales / summary.deliveredOrders).toFixed(2))
                    : 0
        };
    }


    /// Admin dashboard sales trend (weekly revenue)
    async getAdminSalesTrend(query = {}) {

        const { filter: dateFilter, period } = buildDateFilter(query);

        // Only delivered orders generate revenue
        const deliveredOrders = await OrderModel.find({
            ...dateFilter,
            orderStatus: orderStatus.DELIVERED,
        }).lean();

        // Always return 5 weeks
        const weeklyRevenue = Array.from({ length: 5 }, (_, index) => ({
            label: `Week ${index + 1}`,
            revenue: 0,
        }));

        for (const order of deliveredOrders) {

            const day = new Date(order.createdAt).getDate();

            // Day 1-7 => Week 1
            // Day 8-14 => Week 2
            // Day 15-21 => Week 3
            // Day 22-28 => Week 4
            // Day 29-31 => Week 5
            const weekIndex = Math.ceil(day / 7) - 1;

            weeklyRevenue[weekIndex].revenue += order.totalAmount;
        }

        const totalRevenue = weeklyRevenue.reduce(
            (sum, week) => sum + week.revenue,
            0
        );

        return {
            period,
            totalRevenue,
            chart: weeklyRevenue,
        };
    }


    /// Vendor dashboard sales trend (weekly revenue)
    async getVendorSalesTrend(vendorId, query = {}) {

        const { filter: dateFilter, period } = buildDateFilter(query);

        // Only delivered order items generate revenue
        const deliveredOrders = await OrderItemsModel.find({
            vendorId,
            ...dateFilter,
            orderItemsStatus: orderStatus.DELIVERED,
        }).lean();

        // Always return 5 weeks
        const weeklyRevenue = Array.from({ length: 5 }, (_, index) => ({
            label: `Week ${index + 1}`,
            revenue: 0,
        }));

        for (const order of deliveredOrders) {

            const day = new Date(order.createdAt).getDate();

            // Day 1-7 => Week 1
            // Day 8-14 => Week 2
            // Day 15-21 => Week 3
            // Day 22-28 => Week 4
            // Day 29-31 => Week 5
            const weekIndex = Math.ceil(day / 7) - 1;

            weeklyRevenue[weekIndex].revenue += order.totalPrice;
        }

        const totalRevenue = weeklyRevenue.reduce(
            (sum, week) => sum + week.revenue,
            0
        );

        return {
            period,
            totalRevenue,
            chart: weeklyRevenue,
        };
    }
}


export default new OrderServices();