import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/dbConnect.js";
import config from "./config/config.js";

import authRouters from "./routes/auth.route.js";
import vendorRouters from "./routes/vendor.routes.js"
import userRouters from "./routes/user.route.js";

import { NotFoundError } from "./utils/AppError.js";
import { upload } from "./middleware/multer.middleware.js";
import cloudinaryConnect from "./config/cloudinary.config.js";
import shopRouters from "./routes/shop.routes.js"

const app = express();
const PORT = config.port;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

/// User Routes
app.use("/api", userRouters);

//// routes
app.use("/api/auth", authRouters);

/// vendor routes
app.use("/api", vendorRouters)

/// shop routers
app.use("/api", shopRouters);

/// file upload for testing
app.use("/file-upload",  upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]), vendorRouters)

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
