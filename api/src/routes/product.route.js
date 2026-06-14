import { Router } from "express";
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import {
    getAllProducts, addProductImage, createProduct,
    deleteProduct, deleteProductImage, getMyProducts, getMyProductsById,
    getProductByShop, getProductBySlug, getProductsById, productVideoUpload, updateProductVideo,
    updateProductImage, updateProductInfo, updateStatus, deleteProductVideo
} from "../controllers/product.controller.js";
import { productSchema, updateProductSchema } from "../libs/schema/product.schema.js";
import { upload, videoUpload } from "../middleware/multer.middleware.js"

const router = Router()

const forImageVideo = upload.fields([
    { name: "images", maxCount: 8 },
    { name: "videos", maxCount: 2 }
]);

// Create product
router.post("/product/create",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    forImageVideo,
    schemaValidator(productSchema),
    createProduct);

//Get all products
router.get(
    "/products/getall",
    getAllProducts
)

// Get all vendor products
router.get("/vendor/products",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    getMyProducts);

// Get single product by Id Admin
router.get("/product/:id",
    auth,
    roleBasedAuth(Roles.ADMIN_ROLE),
    getProductsById);

// Get product by slug Public
router.get("/product-slug/:slug", getProductBySlug);

// Get products by shop public
router.get("/shop/products/:id", getProductByShop);

// Update product status
router.put("/product/status/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    updateStatus);

// Update product information
router.put("/product/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    schemaValidator(updateProductSchema),
    updateProductInfo);


// Replace single product image
router.patch("/product/single-image/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    upload.single("image"),
    updateProductImage);


// Add multiple product images
router.patch("/product/multiple-images/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    upload.array("images", 4),
    addProductImage);

// Delete product image
router.delete("/product/delete/image/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    deleteProductImage);

// For Upload video
router.put("/product/add-video/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    upload.single("video"),
    productVideoUpload,
);


/// For update/Replace product video 
router.put("/product/update-video/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    upload.single("video"),
    updateProductVideo);


// For deleting video
router.delete("/product/delete/video/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    deleteProductVideo);



// Delete product
router.delete("/product/delete/:id",
    auth,
    roleBasedAuth(Roles.VENDOR_ROLE),
    deleteProduct);



export default router;