

import { v2 as cloudinary } from "cloudinary"
import config from "./config.js"
import { BadRequestError, UnauthorizedError } from "../utils/AppError.js"


//// cloudinary configuraction.

const cloudinaryConnect = ()=>{
    cloudinary.config({
            cloud_name: config.cloud_name,
            api_key: config.cloudinaryAPI_KEY,
            api_secret: config.cloudinaryAPI_SECRET
        });
        console.log("Cloudinary configured.");
        verifyConnection();
}

/// checked cloudinary connection verifactions.
   const verifyConnection= async () => {
        try {
            const result = await cloudinary.api.ping();
            if (result.status !== "ok") {
                throw new UnauthorizedError("Cloudinary ping failed.");

            }
            console.log("Cloudinary connection verified.");
        } catch (error) {
            console.error(error?.error?.message);
            throw new BadRequestError(`Cloudinary Error. ${error?.error?.message}`);
        }
    }

export default cloudinaryConnect;

