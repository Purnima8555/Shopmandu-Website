
import { Router } from "express"
import roleBasedAuth from "../middleware/roleBase.middleware.js"
import Roles from "../constants/userRoles.js"
import auth from "../middleware/auth.middleware.js"

import { upload } from "../middleware/multer.middleware.js"


import {applyForVendor, fileUpload, filterVendor, getVendorById, getVendorProfile, getVendors, vendorKycApprove, vendorKycReject, vendorKycResubmit, vendorKycStatus, vendorKycVerify, video_Upload} from "../controllers/vendor.controller.js"
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import vendorSchema from "../libs/schema/vendor.schema.js";

const router = Router()

router.post("/vendor/apply", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.fields([
  { name: "frontSideImage", maxCount: 1 },
  { name: "backSideImage", maxCount: 1 },
]), schemaValidator(vendorSchema), applyForVendor)



router.get("/vendor/profile", auth, roleBasedAuth(Roles.VENDOR_ROLE), getVendorProfile )




router.get("/vendor/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE),getVendorById) 
router.get("/vendors/all", auth, roleBasedAuth(Roles.ADMIN_ROLE), getVendors)
router.get("/vendors", auth, roleBasedAuth(Roles.ADMIN_ROLE), filterVendor)

//// vendor for kyc verifaction.
router.get("/vendor/kyc/status", auth,roleBasedAuth(Roles.VENDOR_ROLE), vendorKycStatus)
router.get("/vendor/kyc/:id", auth,roleBasedAuth(Roles.ADMIN_ROLE), vendorKycVerify)

router.put("/vendor/kyc/:id/approve", auth, roleBasedAuth(Roles.ADMIN_ROLE), vendorKycApprove )
router.put("/vendor/kyc/:id/reject", auth, roleBasedAuth(Roles.ADMIN_ROLE), vendorKycReject )

router.put("/vendor/kyc/resubmit", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.fields([
  { name: "frontSideImage", maxCount: 1 },
  { name: "backSideImage", maxCount: 1 },
]), schemaValidator(vendorSchema), vendorKycResubmit)



// router.post("/image", fileUpload)
// router.post("/video",upload.single("video"),video_Upload);
/// update vendor
// router.put("/vendor/update-detail/", auth, )
// router.put("/vendor/update-profile/", auth, )



export default router;





