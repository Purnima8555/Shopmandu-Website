
import dotenv from "dotenv"

dotenv.config()


const config = {
    mongoDB_URL: process.env.MONGODB_URL || "",
    port: process.env.PORT || "3000",
    jwtSecret: process.env.JWT_SECRET,

    // email pass
    emailUser: process.env.EMAIL_USER || "",
    passUser: process.env.PASS_USER || "",

    //// google credentials
    client_Id: process.env.CLIENT_ID,
    client_Secret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE,
    redirect_URI: process.env.REDIRECT_URI,
    project_ID: process.env.PROJECT_ID,


    /// cloudinary credentials
    cloud_name: process.env.CLOUD_NAME,
    cloudinaryAPI_KEY: process.env.API_KEY,
    cloudinaryAPI_SECRET: process.env.API_SECRET,

    /// khalti credentials
    khalti_api: process.env.KHALTI_API

}

export default config

