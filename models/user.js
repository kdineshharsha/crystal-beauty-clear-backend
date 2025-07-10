import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    default: "Not given",
  },
  savedAddresses: {
    type: [addressSchema],
    default: [],
  },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = mongoose.model("users", userSchema);
export default User;
