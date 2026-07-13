

import express from "express";
import auth from "../middleware/auth.middleware.js"
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
} from "../controllers/wishlist.controller.js";
import roleBasedAuth from "../middleware/roleBase.middleware.js";
import Roles from "../constants/userRoles.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(auth);
// rolebase 
router.use(roleBasedAuth(Roles.USER_ROLE))

router.get("/", getWishlist);                                 // GET    /wishlist
router.post("/add", addToWishlist);                           // POST   /wishlist/add
router.delete("/remove/:productId", removeFromWishlist);      // DELETE /wishlist/remove/:productId
router.delete("/clear", clearWishlist);                       // DELETE /wishlist/clear
router.post("/move-to-cart/:productId", moveToCart);          // POST   /wishlist/move-to-cart/:productId

export default router;

