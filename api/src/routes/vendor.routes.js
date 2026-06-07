
import { Router } from "express"
import roleBasedAuth from "../middleware/roleBase.middleware.js"
import Roles from "../constants/userRoles.js"
import auth from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { getVendorById, getVendorKyc, getVendorKycStatus, getVendorProfile, rejectVendorKyc, vendorkycSubmit, getVendorKycVerifyDoc, getKycByStatus, updateVendorName, updateVendorAvatar, filterVendors, getAllVendors, approveVendorKyc } from "../controllers/vendor.controller.js"
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import vendorkycSchema from "../libs/schema/vendorkyc.schema.js"

const router = Router()

/// submit kyc detail and document
router.post("/vendor/submit/kyc", auth, roleBasedAuth(Roles.VENDOR_ROLE),
  upload.fields([
    { name: "frontSideImage", maxCount: 1 },
    { name: "backSideImage", maxCount: 1 },
  ]), schemaValidator(vendorkycSchema), vendorkycSubmit)

/// resubmit kyc document.
router.put("/vendor/resubmit/kyc", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.fields([
  { name: "frontSideImage", maxCount: 1 },
  { name: "backSideImage", maxCount: 1 },
]), schemaValidator(vendorkycSchema), vendorkycSubmit)

//// update vendor there user name.
router.patch("/vendor/update-name", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateVendorName)
/// update vendor ther avatar.
router.patch("/vendor/update-avatar", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.single("avatar"), updateVendorAvatar)

/// get there kyc status
router.get("/vendor/kyc/status", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorKycStatus)

//// get kyc detail status by there own 
router.get("/vendor/kyc/", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorKyc)
/// get vendor own profile detail.
router.get("/vendor/profile", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorProfile)



/// get all vendors (with optional filters)
router.get("/admin/vendors", auth, roleBasedAuth(Roles.ADMIN_ROLE), filterVendors);

/// get all vendors (no filters - full list)
router.get("/admin/vendors/all", auth, roleBasedAuth(Roles.ADMIN_ROLE), getAllVendors);

/// get vendor by ID
router.get("/admin/vendor/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), getVendorById);


/// get KYC documents filtered by status (pending/approved/rejected)
router.get("/admin/kyc/status-filter", auth, roleBasedAuth(Roles.ADMIN_ROLE), getKycByStatus)
// admin approve there kyc document
router.put("/admin/kyc/:id/approve", auth, roleBasedAuth(Roles.ADMIN_ROLE), approveVendorKyc)
router.put("/admin/kyc/:id/reject", auth, roleBasedAuth(Roles.ADMIN_ROLE), rejectVendorKyc)

/// admin get vendor kyc document by kyc ID
router.get("/admin/kyc/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), getVendorKycVerifyDoc)




export default router;





