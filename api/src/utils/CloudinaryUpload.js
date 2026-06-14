import { v2 as cloudinary } from "cloudinary"
import { BadRequestError, UnauthorizedError } from "./AppError.js"
import cloudinaryConnect from "../config/cloudinary.config.js";
import { file } from "zod";


class CloudinaryFileUpload {
    async uploadSingleImage(file, type = 'upload') {
        if (file.size > 1024 * 1024 * 8) {
            throw new BadRequestError("File size must be less then 8MB.")
        }
        const result = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "my_Images",
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', "avif"],
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
                        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
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
        if (video.size > 1024 * 1024 * 23) {
            throw new BadRequestError("File size must be less then 23MB.")
        }
            const result = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "my_Video",
                allowed_formats: ['mp4', 'webm'],
                resource_type: "video",
                type: type,
                timeout: 60000*2 // 2 minute safeguard
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

   /* For multiple videos not more than 23 MB */
    async multipleVideoUpload(videoFiles, type = "upload") {
        videoFiles.forEach(file => {
            if (file.size > 1024 * 1024 * 23) {
                throw new BadRequestError("Each video file size must be less than 23MB.")
            }
        });

        const uploadPromises = videoFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "my_Video",
                        allowed_formats: ['mp4', 'webm'],
                        resource_type: "video", // Required specification for Cloudinary transcoders
                        type: type,
                        timeout: 60000*2 // 2 minute safeguard
                    },
                    (error, data) => {
                        if (error) {
                            console.error("Cloudinary Video Error Details:", error);
                            return reject(error);
                        }
                        resolve(data);
                    }
                );
                stream.end(file.buffer);
            });
        });
        return Promise.all(uploadPromises);
    }
} 
export default new CloudinaryFileUpload();