import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import verifyJWT from "./middleware/auth.js";
import orderRouter from "./routes/orderRouter.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const port = 3000;
const app = express();
app.use(cors());

// Use the MONGO_URL from environment variables
mongoose.connect(process.env.MONGO_URL).then(
  () => {
    console.log("Connected to the Database successfully");
  },
  (error) => {
    console.log("Error connecting to the database", error);
  }
);

app.use(bodyParser.json());

// Middleware to verify JWT for protected routes
app.use(verifyJWT);

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
