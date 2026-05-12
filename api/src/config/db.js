import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUrl);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB not Connected");
        console.log(error.message);
    }
};

export default connectDB;