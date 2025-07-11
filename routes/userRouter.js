import express from "express";
import {
  saveUser,
  loginUser,
  googleLogin,
  getCurrentUser,
  sendOTP,
  changePassword,
  setUserStatus,
  getAllUsers,
  getUserWithOrders,
  getUserById,
  updateUser,
  deleteUser,
  updateAddress,
  addAddress,
  deleteAddress,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
// userRouter.get("/user-profile/:id", getUserWithOrders);

userRouter.post("/register", saveUser);
userRouter.post("/login", loginUser);
userRouter.post("/google", googleLogin);
userRouter.get("/current", getCurrentUser);
userRouter.get("/:email", getUserById);
userRouter.post("/sendMail", sendOTP);
userRouter.post("/changePW", changePassword);
userRouter.put("/update", updateUser);
userRouter.delete("/delete", deleteUser);
userRouter.post("/add-address", addAddress);
userRouter.patch("/:id/disable", setUserStatus);
userRouter.put("/address/:addressId", updateAddress);
userRouter.delete("/address/:addressId", deleteAddress);

export default userRouter;
