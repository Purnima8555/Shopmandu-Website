import cors from "cors";
import express from "express";

import cloudinaryConnect from "./config/cloudinary.config.js";
import connectDB from "./config/db.js";

import userRouters from "./routes/user.route.js";
import vendorRouters from "./routes/vendor.routes.js";
import authRouters from "./routes/auth.route.js";

import { upload } from "./middleware/multer.middleware.js";
import { NotFoundError } from "./utils/AppError.js";

const app = express();

/// Middlewares
app.use(express.json());
app.use(cors());

/// User Routes
app.use("/api", userRouters);

//// routes
app.use("/api/auth", authRouters);

/// vendor routes
app.use("/api", vendorRouters);

/// File Upload Route (optional testing route)
app.use(
  "/file-upload",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  vendorRouters,
);

/// Handle Unknown Routes
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

/// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_ERROR",
    details: err.details || null,
  });
});

const PORT = process.env.PORT || 3000;

/// Start Server
app.listen(PORT, async () => {
  try {
    await cloudinaryConnect();
    await connectDB();

    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
});
