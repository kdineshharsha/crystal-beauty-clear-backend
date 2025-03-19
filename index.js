import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import verifyJWT from "./middleware/auth.js";
import orderRouter from "./routes/orderRouter.js";

const port = 3000;
const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:dineshharsha182@cluster0.2p40u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(
    () => {
      console.log("Connected to the Database successfully");
    },
    (error) => {
      console.log("Error connecting to the database");
    }
  );

app.use(bodyParser.json());

app.use(verifyJWT);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use(express.json());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
