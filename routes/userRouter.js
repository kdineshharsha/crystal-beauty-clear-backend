import express from "express";
import {
  saveUser,
  loginUser,
  googleLogin,
  getCurrentUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);
userRouter.get("/current", getCurrentUser);

export default userRouter;
