import express from "express";
import {
  saveUser,
  loginUser,
  googleLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);

export default userRouter;
