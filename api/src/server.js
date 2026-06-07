import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/dbConnect.js";
import config from "./config/config.js";

import authRouters from "./routes/auth.route.js";
import vendorRouters from "./routes/vendor.routes.js"
import { NotFoundError } from "./utils/AppError.js";
import { upload } from "./middleware/multer.middleware.js";
import cloudinaryConnect from "./config/cloudinary.config.js";
import shopRouters from "./routes/shop.routes.js"
import payment from "./utils/PaymentIntegration.js";

import addressRouters from "./routes/address.route.js"
import cartRouters from "./routes/cart.route.js"
import wishlistRouters from "./routes/wishlist.route.js"
import productRouters from "./routes/product.route.js"

// // import { success } from "zod";
// import { is } from "zod/v4/locales";

const app = express();
const PORT = config.port;

app.use(bodyParser.json());
app.use(express.json());

//// routes
app.use("/api/auth", authRouters);

/// vendor routes
app.use("/api", vendorRouters)

/// shop routers
app.use("/api", shopRouters);

/// address routers 
app.use("/api/address", addressRouters)

/// cart routers

app.use("/api/cart", cartRouters)
app.use("/api/wishlist", wishlistRouters)

/// product routers

app.use("/api", productRouters)

//// khalti payment for testing.
app.post("/api/pay",  async (req,res) => { 
  
  try {
    const payload = req.body;
    // console.log(payload)
   const khaltiUrl= await payment.payWithKhalti(payload)
   res.status(200).json({
    success: true,
    message: "Khalti pay url generate succesfull",
    data: khaltiUrl
   })
  } catch (error) {
    res.status(500).json({message: "Something wind wrong.", error: error.message})
  }
 })

app.get("/api/payment/checkout", async (req, res)=>{
 try {
  const {pidx, transaction_id, tidx, txnId, amount, total_amount, mobile, status, purchase_order_id, purchase_order_name} = req.query
 const isVerify = await payment.verifyKhaltiPayment( { pidx, transaction_id })
 res.status(200).json({isVerify})
 } catch (error) {
  res.status(500).json({message: "Something wind wrong.", error: error.message})
 }
//  res.status(200).json({message: 'paynment succesfull', data: {pidx, transaction_id, tidx, txnId, amount: amount/100, total_amount: total_amount/100, mobile, status, purchase_order_id, purchase_order_name}})
})


//// handle unknown routes (optional but recommended)
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

///  error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    code: err.code || "INTERNAL_ERROR",
    details: err.details || null,
  });
});

app.listen(PORT, async () => {
  await cloudinaryConnect()
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});