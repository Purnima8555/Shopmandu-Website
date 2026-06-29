import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/dbConnect.js";
import config from "./config/config.js";

import authRouters from "./routes/auth.route.js";
import vendorRouters from "./routes/vendor.routes.js"
import cloudinaryConnect from "./config/cloudinary.config.js";
import shopRouters from "./routes/shop.routes.js"

import addressRouters from "./routes/address.route.js"
import cartRouters from "./routes/cart.route.js"
import wishlistRouters from "./routes/wishlist.route.js"
import productRouters from "./routes/product.route.js"
import orderRoutes from "./routes/order.route.js"

import { connectRedis } from "./config/redis.config.js"
import client from "./config/redis.config.js"
import paymentRouters from "./routes/payment.route.js"

import couponRouters from "./routes/coupon.route.js"
import categoryRoters from "./routes/category.route.js"
import { errorMiddleware, RouteNotFoundMiddleware } from "./middleware/error.middleware.js";
import helmet from "helmet"
import cors from "cors"


const app = express();
const PORT = config.port;

app.use(helmet())
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: config.client_url,
    credentials: true,
  })
);
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
// order routers
app.use("/api/order", orderRoutes)
/// payment routes
app.use("/api", paymentRouters)
/// coupon Routers
app.use("/api/coupon", couponRouters)

/// category Routers
app.use("/api/category", categoryRoters)


/// error handel
app.use(RouteNotFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, "0.0.0.0", async () => {
  await connectRedis()
  await cloudinaryConnect()
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
}
);
