


import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js"
import auth from "../middleware/auth.middleware.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import shopSchema from "../libs/schema/shop.schema.js";
import { createShop, getShopBySlug, myShop, updateShopBanner, updateShopInfo, updateShopLogo, updateShopStatus, updateShopStatusByAdmin } from "../controllers/shop.controller.js";

const router = Router()

/// create shop
router.post("/shop/create", auth, roleBasedAuth(Roles.VENDOR_ROLE), 
    upload.fields([
      {name: 'logo', maxCount: 1},
      {name: 'banner', maxCount: 1}
    ]),
    schemaValidator(shopSchema),
    createShop
)


/// get shop by slug
router.get("/shop/:slug", getShopBySlug);
router.get("/vendor/my-shop", auth, roleBasedAuth(Roles.VENDOR_ROLE), myShop);

/// update shop information only text
router.put("/shop/update", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateShopInfo)


/// update shop logo
router.patch("/shop/logo-update", auth, roleBasedAuth(Roles.VENDOR_ROLE),
upload.single("logo"),
updateShopLogo
)
/// update shop banner
router.patch("/shop/banner-update", auth, roleBasedAuth(Roles.VENDOR_ROLE),
upload.single("banner"),
updateShopBanner
)

//// update shop status by vendor 
router.patch("/shop/status-update", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateShopStatus)

/// update shop status by admin
router.patch("/admin/shops/:id/status", auth, roleBasedAuth(Roles.ADMIN_ROLE), updateShopStatusByAdmin)

export default router;







