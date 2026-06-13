

import {Router} from "express"
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import {orderPlace,cancelOrder, getOrderHistory, adminGetOrderById} from "../controllers/order.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import createOrderSchema from "../libs/schema/order.schema.js";

const router = Router();


router.post("/place", auth, roleBasedAuth(Roles.USER_ROLE), schemaValidator(createOrderSchema), orderPlace)

router.patch("/:orderId/cancel", auth, roleBasedAuth(Roles.USER_ROLE), cancelOrder)

router.get("/history", auth, roleBasedAuth(Roles.USER_ROLE), getOrderHistory);

router.get("/admin/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), adminGetOrderById)


export default router;
