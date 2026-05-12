import dotenv from "dotenv";

dotenv.config();

const config = {
    mongodbUrl: process.env.MONGODB_URL || "",
    port: process.env.PORT || "",
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
};

export default config;