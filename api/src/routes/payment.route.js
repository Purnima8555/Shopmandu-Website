


import {Router} from "express"
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { getAllPayments, getMyPaymentHistory, getPaymentById, paymentCheckOut, payOrder, verifyStripeCheckout } from "../controllers/payment.controller.js";


const router = Router();

router.post("/order/pay",  auth, roleBasedAuth(Roles.USER_ROLE), payOrder)

router.get("/payment/checkout", paymentCheckOut);

// stripe checkout
router.get("/payment/success", verifyStripeCheckout);

router.get("/payment/history", auth, roleBasedAuth(Roles.USER_ROLE), getMyPaymentHistory);

router.get("/payment/:id", auth, roleBasedAuth(Roles.USER_ROLE), getPaymentById);


router.get("/admin/payments", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllPayments)

export default router;