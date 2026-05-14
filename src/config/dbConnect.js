

// import dotenv from "dotenv"
import mongoose from "mongoose"
import config from "./config.js"


// dotenv.config()

// const URL = process.env.MONGODB_URL

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(config.mongoDB_URL);
        console.log("Connected succesfully : ",connect.connection.host)
    } catch (error) {
        console.log("MongoDB Connection Error: ", error.message)
    }
}


export default connectDB

