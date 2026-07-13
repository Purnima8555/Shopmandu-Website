import dotenv from "dotenv"

dotenv.config()

const config = Object.freeze({
    mongoDB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/shopmandu",
    port: process.env.PORT || "5000",
    node_env : process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET || "supersecretlocaldevelopmentkey",

    // email pass
    emailUser: process.env.EMAIL_USER || "",
    passUser: process.env.PASS_USER || "",

    //// google credentials
    client_Id: process.env.CLIENT_ID || "mock-client-id",
    client_Secret: process.env.CLIENT_SECRET || "mock-client-secret",
    // Fixes the crash: guarantees a string to .split("-") even if empty in .env
    scope: process.env.SCOPE || "openid-email-profile", 
    redirect_URI: process.env.REDIRECT_URI || "http://localhost:5000/api/auth/google/callback",
    project_ID: process.env.PROJECT_ID || "mock-project-id",

    /// cloudinary credentials
    cloud_name: process.env.CLOUD_NAME || "",
    cloudinaryAPI_KEY: process.env.API_KEY || "",
    cloudinaryAPI_SECRET: process.env.API_SECRET || "",

    /// khalti credentials
    khalti_api: process.env.KHALTI_API || "",
    khalti_request_uri: process.env.REQUEST_URI || "https://dev.khalti.com/api/v2/epayment/initiate/",
    khalti_redirect_uri: process.env.PAYMENT_REDIRECT_URI || "http://localhost:5000/api/payment/khalti/callback",
    web_uri: process.env.WEB_URI || "http://localhost:3000",
    khalti_lookup_uri: process.env.KHALTI_PAYMENT_LOOKUP_URI || "https://a.khalti.com/api/v2/epayment/lookup/",

    encrypt_Key: process.env.ENCRYPT_KEY || "abcdefghijklmnopqrstuvwxyz123456",

    /// stripe credentials
/// stripe credentials
    stripe_secret_key: process.env.STRIPE_SECRET_KEY || "sk_test_51MockKeyPlaceHolderSecret12345",
    stripe_publishable_key: process.env.STRIPE_PUBLIC_KEY || "pk_test_51MockKeyPlaceHolderPublic12345",
    client_url: process.env.CLIENT_URL || "http://localhost:3000",

    /// gemini key
    gemini_key: process.env.GEMINI_API_KEY || "",
})

export default config