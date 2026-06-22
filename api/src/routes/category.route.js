
import { Router } from "express";
import auth from "../middleware/auth.middleware.js"
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import { createProductCategory, deleteProductCategory, getActiveProductCategories, getAllProductCategories, getProductCategoryById, toggleProductCategoryStatus, updateProductCategory } from "../controllers/Category.controller.js";
import { categoryschema, updateCategorySchema } from "../libs/schema/category.schema.js";

const router = Router()

router.use(auth)

/// create category
router.post("/", roleBasedAuth(Roles.ADMIN_ROLE), schemaValidator(categoryschema), createProductCategory);

//// get all categorys
router.get("/", getAllProductCategories);

//// get active categories 
router.get("/active", getActiveProductCategories);

/// get category by Id
router.get("/:categoryId", getProductCategoryById);


/// update category 
router.put("/:categoryId",  roleBasedAuth(Roles.ADMIN_ROLE), schemaValidator(updateCategorySchema), updateProductCategory);


/// update category status.
router.patch(
    "/:categoryId/toggle-status",
    roleBasedAuth(Roles.ADMIN_ROLE),
    toggleProductCategoryStatus
);

/// delete category
router.delete("/:categoryId",  roleBasedAuth(Roles.ADMIN_ROLE), deleteProductCategory);

export default router;