
import dotenv from "dotenv"

dotenv.config()


const config = Object.freeze({
    mongoDB_URL: process.env.MONGODB_URL || "",
    port: process.env.PORT || "3000",
    node_env : process.env.NODE_ENV,
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
    khalti_api: process.env.KHALTI_API,
    khalti_request_uri: process.env.REQUEST_URI,
    khalti_redirect_uri: process.env.PAYMENT_REDIRECT_URI,
    web_uri: process.env.WEB_URI,
    khalti_lookup_uri: process.env.KHALTI_PAYMENT_LOOKUP_URI,

    /// stripe credentials
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_redirect_uri: process.env.STRIPE_REDIRECT_URI,
    stripe_cancel_uri: process.env.STRIPE_CANCEL_URI,
    
    encrypt_Key: process.env.ENCRYPT_KEY,

    /// stripe credentials
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_publishable_key: process.env.STRIPE_PUBLIC_KEY,

    /// gemini key
    gemini_key: process.env.GEMINI_API_KEY,
})

export default config