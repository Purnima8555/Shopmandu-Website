import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoute from "./routes/product.route.js"
import multer from "multer";
import connectCloudinary from "./config/cloudiinary.js"

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

connectDB();
connectCloudinary();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/products", upload.array("images", 5), productRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});