import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import { upload } from "../middleware/multer.middleware.js";
import returnController from "../controllers/return.controller.js";

const router = Router();

// CUSTOMER
router.post("/", auth, roleBasedAuth(Roles.USER_ROLE), upload.array("images", 4), returnController.createReturnRequest);
router.get("/customer", auth, roleBasedAuth(Roles.USER_ROLE), returnController.getCustomerRequests);

// VENDOR
router.get("/vendor", auth, roleBasedAuth(Roles.VENDOR_ROLE), returnController.getVendorRequests);
router.patch("/:id/approve", auth, roleBasedAuth(Roles.VENDOR_ROLE), returnController.approveRequest);
router.patch("/:id/reject", auth, roleBasedAuth(Roles.VENDOR_ROLE), returnController.rejectRequest);
router.patch("/:id/returned", auth, roleBasedAuth(Roles.VENDOR_ROLE), returnController.markReturned);
router.patch("/:id/refund", auth, roleBasedAuth(Roles.VENDOR_ROLE), returnController.refundRequest);

export default router;