import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";

import { placeNewOrder, customerOrderHistory, orderDetail, orderCancel, getAllOrderByVendorId, updateOrderItemStatus, getAllOrder,
    getOrdersByStatus, getOrderById, adminUpdateOrderStatus } from "../controllers/order.controller.js";

const router = Router();


// CUSTOMER ROUTES
router.post("/orders", auth, placeNewOrder);
router.get("/orders", auth, customerOrderHistory);
router.get("/orders/:orderId", auth, orderDetail);
router.patch("/orders/:orderId/cancel", auth, orderCancel);

// VENDOR ROUTES
router.get("/vendor/orders", auth, roleBasedAuth(Roles.VENDOR_ROLE), getAllOrderByVendorId);
router.patch("/vendor/orders/:orderId/items/:itemId/status", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateOrderItemStatus);

// ADMIN ROUTES
router.get("/admin/orders", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllOrder);
router.get("/admin/orders/status", auth, roleBasedAuth(Roles.ADMIN_ROLE), getOrdersByStatus);
router.get("/admin/orders/:orderId", auth, roleBasedAuth(Roles.ADMIN_ROLE), getOrderById);
router.patch("/admin/orders/:orderId/status", auth, roleBasedAuth(Roles.ADMIN_ROLE), adminUpdateOrderStatus);

export default router;
