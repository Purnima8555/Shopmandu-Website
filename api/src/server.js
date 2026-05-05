import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoute from "./routes/product.route.js"

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/products", productRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});