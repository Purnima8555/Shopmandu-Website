

import express from "express";
import auth from "../middleware/auth.middleware.js";
import addressSchema from "../libs/schema/address.schema.js"
import {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import schemaValidator from "../middleware/schemaValidator.middleware.js";

const router = express.Router();

// All address routes require authentication
router.use(auth);

router.get("/", getAddresses);             // GET  /address
router.get("/:id", getAddressById);        // GET  /address/:id
router.post("/add",  schemaValidator(addressSchema),  addAddress);           // POST /address/add
router.put("/update/:id", updateAddress);  // PUT  /address/update/:id
router.delete("/delete/:id", deleteAddress); // DELETE /address/delete/:id

export default router;

