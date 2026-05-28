
import express from "express";
import auth from "../middleware/auth.middleware.js"
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";

const router = express.Router();

// All cart routes require authentication
router.use(auth);
// rolebase 
router.use(roleBasedAuth(Roles.USER_ROLE))

router.get("/",  getCart);                             // GET    /cart
router.post("/add", addToCart);                       // POST   /cart/add
router.put("/update/:productId", updateCartItem);     // PUT    /cart/update/:productId
router.delete("/delete/:productId", removeCartItem);  // DELETE /cart/delete/:productId
router.delete("/clear", clearCart);                   // DELETE /cart/clear

export default router;