import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    orderId: String,
    status: String,
    message: String,
    userEmail: String,
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
