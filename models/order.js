import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  billItems: {
    type: [
      {
        productId: String,
        productName: String,
        image: String,
        quantity: Number,
        price: Number,
      },
    ],

    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalDiscount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
