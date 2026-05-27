import multer from "multer";
import { BadRequestError } from "../utils/AppError.js";


const storage = multer.memoryStorage();

/// image upload
const upload = multer({storage});


/// video upload
const videoUpload = multer({
    storage,
    limits: {
        fileSize: 23 * 1024 * 1024 
    },
    fileFilter: (req, file, next) => {
        const allowedVideoTypes = [
            "video/mp4",
            "video/webm",
        ];

        if (!allowedVideoTypes.includes(file.mimetype)) {
            return next(new BadRequestError("Only video files are allowed!"),
                false
            );
        }

        next(null, true);
    }
});

export {
    upload,
    videoUpload
};