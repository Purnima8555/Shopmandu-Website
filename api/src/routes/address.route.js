import { Router } from "express";
import addressController from "../controllers/address.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";
import addressSchema from "../libs/schema/address.schema.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, schemaValidator(addressSchema), addressController.createAddress);
router.get("/", authMiddleware, addressController.getUserAddresses);
router.put("/:id", authMiddleware, schemaValidator(addressSchema), addressController.updateAddress);
router.delete("/:id", authMiddleware, addressController.deleteAddress);

export default router;
