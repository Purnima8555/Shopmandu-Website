

import { v2 as cloudinary } from "cloudinary"

import { BadRequestError, UnauthorizedError } from "./AppError.js"
import cloudinaryConnect from "../config/cloudinary.config.js";
import { file } from "zod";



class CloudinaryFileUpload {

    // constructor() {
    //     this.configureCloudinary();
    // }

    /**
     * ## for image upload create 4 different function to upload it.
     * 1. uploadeSingleImage() =>
     * 2. uploadSingleImage() =>    
     */

    async uploadSingleImage(file, type = 'upload') {

        if (file.size > 1024 * 1024 * 8) {
            throw new BadRequestError("File size must be less then 8MB.")
        }

        const result = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "my_Images",
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                type: type,
                // access_mode: "authenticated"
                resource_type: "auto"
            },
                /// callback
                (error, data) => {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                    resolve(data)
                }
            );
            stream.end(file.buffer)
        })

        return result;

    }


    async uploadMultipleImage(files, type = 'upload') {

        // if (file.size > 1024 * 1024 * 20) {
        //     throw new BadRequestError("File size must be less then 5MB.")
        // }
        files.forEach(file => {
            if (file > 1024 * 1024 * 8) {
                throw new BadRequestError("Please check your files. Each must be less than 8MB.")
            }
        });

        const uploadPromises = files.map((file) => {
            const result = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "my_Images",
                        allowed_formats: ["jpg", "jpeg", "png", "webp"],
                        type: type
                    },
                    (error, data) => {
                        if (error) return reject(error);
                        resolve(data);
                    }
                );

                stream.end(file.buffer);
            });
            return result;
        });
        return Promise.all(uploadPromises);  /// promise resolve in one single time.
    }


    //// video upload

    async videoUpload(video, type = "upload") {
        if (video.size > 1024 * 1024 * 18) {
            throw new BadRequestError("File size must be less then 18MB.")
        }

            const result = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "my_Video",
                allowed_formats: ['mp4', 'webm'],
                resource_type: "video",
                type: type,
            },
                /// callback
                (error, data) => {
                    if (error) {
                        // console.log(error)
                       return reject(error)
                    }
                    resolve(data)
                }
            );
            stream.end(video.buffer)
        })

        return result;

    }


}

// const cloudinaryins = new CloudinaryFileUpload()
// cloudinaryConnect()


export default new CloudinaryFileUpload();




