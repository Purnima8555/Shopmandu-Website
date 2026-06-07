import multer from "multer";
import { BadRequestError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

// Master upload configuration handling images and videos simultaneously
const upload = multer({
  storage,
  limits: {
    // Max overall single file size limit //highest limit 23MB
    fileSize: 23 * 1024 * 1024 
  },

  fileFilter: (req, file, next) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];

    // 1. Dynamic Check for Images
    if (file.fieldname === "images") {
      if (!allowedImageTypes.includes(file.mimetype)) {
        return next(new BadRequestError("Only JPEG, PNG, and WEBP image files are allowed!"), false);
      }
    }

    // 2. Dynamic Check for Videos
    if (file.fieldname === "video") {
      if (!allowedVideoTypes.includes(file.mimetype)) {
        return next(new BadRequestError("Only MP4 and WEBM video files are allowed!"), false);
      }
    }

    next(null, true);
  }
});

export { upload };