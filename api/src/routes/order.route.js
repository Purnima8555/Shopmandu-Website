

import {Router} from "express"
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import {orderPlace, cancelOrder, getOrderHistory, adminGetOrderById, updateOrderItemStatus, getAllOrders,
        getOrdersByStatus, adminUpdateOrderStatus, getOrderDetail, customerInvoice, vendorInvoice, getVendorSalesSummary,
        getAdminSalesSummary} from "../controllers/order.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import createOrderSchema from "../libs/schema/order.schema.js";

const router = Router();


router.post("/place", auth, roleBasedAuth(Roles.USER_ROLE), schemaValidator(createOrderSchema), orderPlace)

router.get("/history", auth, roleBasedAuth(Roles.USER_ROLE), getOrderHistory);

router.patch("/vendor/item/status", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateOrderItemStatus);

router.get("/admin/orders", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllOrders);

router.patch("/admin/status", auth, roleBasedAuth(Roles.ADMIN_ROLE), adminUpdateOrderStatus);

router.get("/vendor/sales-summary", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorSalesSummary);

router.get("/admin/sales-summary", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAdminSalesSummary);

router.patch("/:orderId/cancel", auth, roleBasedAuth(Roles.USER_ROLE), cancelOrder)

router.get("/detail/:orderId", auth, roleBasedAuth(Roles.USER_ROLE), getOrderDetail);

router.get("/admin/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), adminGetOrderById)

router.get("/invoice/customer/:orderId", auth, roleBasedAuth(Roles.USER_ROLE), customerInvoice);

router.get("/invoice/vendor/:orderItemId", auth, roleBasedAuth(Roles.VENDOR_ROLE), vendorInvoice);

export default router;
