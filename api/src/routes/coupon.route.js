import express from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    applyCoupon
} from "../controllers/coupon.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { couponSchema, couponSchemaUpdate } from "../libs/schema/coupon.schema.js";

const router = express.Router();

// ── Admin routes ─────────────────────────────────────────────────────────
router.post("/", auth, roleBasedAuth(Roles.ADMIN_ROLE), schemaValidator(couponSchema), createCoupon);           // POST   /coupons
router.get("/", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllCoupons);            // GET    /coupons
router.get("/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), getCouponById);         // GET    /coupons/:id
router.put("/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), schemaValidator(couponSchemaUpdate), updateCoupon);          // PUT    /coupons/:id
router.delete("/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), deleteCoupon);       // DELETE /coupons/:id

// ── User route (logged-in users check if a coupon is valid before placing order)
router.post("/apply", auth, roleBasedAuth(Roles.USER_ROLE), applyCoupon);         // POST   /coupons/apply

export default router;