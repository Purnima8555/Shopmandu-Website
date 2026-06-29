

import { Router } from "express";
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { addProductImage, createProduct, deleteProduct, deleteProductImage, getAllFlashSalesProducts, getAllProductForPublic, getMyProducts, getMyProductsById, getProductByShop, getProductBySlug, getProductsById, onFlashSale, productVideoUpload, removeFromFlashSale, updateProductImage, updateProductInfo, updateStatus } from "../controllers/product.controller.js";
import {productSchema, updateProductSchema} from "../libs/schema/product.schema.js";
import { upload, videoUpload } from "../middleware/multer.middleware.js"

const router = Router()



// Create product
router.post("/product/create", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.array("images", 8), schemaValidator(productSchema), createProduct);

// Get all vendor products
router.get("/products", auth, roleBasedAuth(Roles.VENDOR_ROLE), getMyProducts);

// Get single product by Id Admin
router.get("/product/:id", auth, roleBasedAuth(Roles.ADMIN_ROLE), getProductsById);

// Get product by slug Public
router.get("/product-slug/:slug", getProductBySlug);

router.get("/products/public", getAllProductForPublic)

// Get products by shop public
router.get("/shop/products/:id", getProductByShop);

// Update product information
router.put("/product/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), schemaValidator(updateProductSchema), updateProductInfo);

// Update product status
router.put("/product/status/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), updateStatus);


// Replace single product image
router.patch("/product/image/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.single("image"), updateProductImage);

// Add multiple product images
router.patch("/product/images/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), upload.array("images", 4), addProductImage);

// Delete product image
router.delete("/product/delete/image/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), deleteProductImage);

/// product video upload 

router.put("/product/video/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), videoUpload.single("video"), productVideoUpload)


// Delete product
router.delete("/product/delete/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), deleteProduct);

// add on flash sale
router.patch("/product/flash-sale/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), onFlashSale);

// remove from flash sale
router.patch("/product/flash-sale/remove/:id", auth, roleBasedAuth(Roles.VENDOR_ROLE), removeFromFlashSale);

// get all flash sale products for public
router.get("/products/flash-sale", getAllFlashSalesProducts);

export default router;




