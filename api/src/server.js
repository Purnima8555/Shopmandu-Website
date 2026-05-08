import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // This looks inside the current 'src' folder;
import userRoutes from "./routes/user.route.js";

dotenv.config(); // Load variables from .env
connectDB();    // Connect to Database

const app = express();

// Middleware to read JSON (very important for CRUD!)
app.use(express.json());

// Link your user routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));