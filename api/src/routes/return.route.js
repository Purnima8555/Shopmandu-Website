import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import { upload } from "../middleware/multer.middleware.js";
import createReturnRequestSchema from "../libs/schema/return.schema.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { createReturnRequest, getCustomerRequests, getVendorRequests, approveRequest,
        rejectRequest, markReturned, refundRequest } from "../controllers/return.controller.js";

const router = Router();

// customer
router.post("/", auth, roleBasedAuth(Roles.USER_ROLE), upload.array("images", 4), schemaValidator(createReturnRequestSchema), createReturnRequest);
router.get("/customer", auth, roleBasedAuth(Roles.USER_ROLE), getCustomerRequests);

// vendor
router.get("/vendor", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorRequests);
router.patch("/:id/approve", auth, roleBasedAuth(Roles.VENDOR_ROLE), approveRequest);
router.patch("/:id/reject", auth, roleBasedAuth(Roles.VENDOR_ROLE), rejectRequest);
router.patch("/:id/returned", auth, roleBasedAuth(Roles.VENDOR_ROLE), markReturned);
router.patch("/:id/refund", auth, roleBasedAuth(Roles.VENDOR_ROLE), refundRequest);
export default router;