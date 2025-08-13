import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import colors from "colors"
import cookieParser from "cookie-parser";
import api_base_router from "./src/routes/api_base_router.js";

// Initialize environment variables
dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5174", credentials: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/review_seller")
    .then(() => console.log(colors.bgMagenta("MongoDB Connected Success")))
    .catch(error => console.error(colors.bgRed("MongoDB connection error:"), error));


// First version api base url
app.use("/api/v1", api_base_router);

// Running the server GET request
app.get("/", (req, res) => {
    res.send("Server Running Success!")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})