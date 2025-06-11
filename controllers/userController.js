import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import { OTP } from "../models/otp.js";

// Load environment variables from .env file
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "dineshharsha182@gmail.com",
    pass: "ybsfbcqrzujbmqvu",
  },
});

export function saveUser(req, res) {
  // Only allow admin to create another admin
  if (req.body.role == "admin") {
    if (req.user == null) {
      return res.status(403).json({
        message: "Please login as an admin before creating an admin",
      });
    }
    return;
  }

  // if (req.user.role !== "admin") {
  //   return res.status(403).json({
  //     message: "You are not authorized to create a user",
  //   });
  // }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
  });

  user
    .save()
    .then(() => {
      return res.json({
        message: "User saved successfully",
      });
    })
    .catch(() => {
      return res.status(500).json({
        message: "User not saved",
      });
    });
}
export function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user == null) {
        return res.status(404).json({
          message: "Invalid email",
        });
      }

      // 🔒 Prevent login if user is disabled
      if (user.isDisabled) {
        return res.status(403).json({
          message: "This account is disabled. Please contact admin.",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };

        const token = jwt.sign(userData, process.env.JWT_SECRET);

        return res.json({
          message: "Login successful",
          token: token,
          user: userData,
        });
      } else {
        return res.status(403).json({
          message: "Invalid password",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
}

export async function googleLogin(req, res) {
  const accessToken = req.body.accessToken;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const user = await User.findOne({ email: response.data.email });

    if (user) {
      // 🔒 Prevent login if user is disabled
      if (user.isDisabled) {
        return res.status(403).json({
          message: "This account is disabled. Please contact admin.",
        });
      }

      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isDisabled: user.isDisabled,
        isEmailVerified: user.isEmailVerified,
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "48hrs",
      });

      return res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    } else {
      // 👤 Create new user if not found
      const newUser = new User({
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        isEmailVerified: true,
        password: accessToken, // temporary, since Google handles auth
      });

      await newUser.save();

      const userData = {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        role: "user",
        phone: "Not given",
        isDisabled: false,
        isEmailVerified: true,
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "48hrs",
      });

      res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Google login failed",
    });
  }
}

export function getCurrentUser(req, res) {
  if (req.user == null) {
    return res.status(403).json({
      message: "Please login to access this resource",
    });
  }

  return res.json({
    user: req.user,
  });
}
export function sendOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(10000 + Math.random() * 90000);

  const message = {
    to: email,
    subject: "OTP for password reset",
    text: `Your OTP for password reset is ${otp}`,
  };

  const newOTP = new OTP({
    email: email,
    otp: otp,
  });
  newOTP
    .save()
    .then(() => {
      console.log("OTP saved successfully");
    })
    .catch(() => {
      console.log("Error saving OTP");
    });
  // Send OTP to email

  transport.sendMail(message, (error, info) => {
    if (error) {
      return res.status(500).json({
        message: "Error sending OTP",
      });
    } else {
      return res.json({
        message: "OTP sent successfully",
        otp: otp,
      });
    }
  });
}

export async function changePassword(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const otp = req.body.otp;
  try {
    //get latest otp from db
    const lastOTPData = await OTP.findOne({
      email: email,
    }).sort({ createdAt: -1 });

    if (lastOTPData == null) {
      res.status(404).json({
        message: "No OTP found for this email",
      });
      return;
    }
    if (lastOTPData.otp != otp) {
      res.status(403).json({
        message: "Invalid OTP",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.updateOne(
      {
        email: email,
      },
      {
        password: hashedPassword,
      }
    );
    await OTP.deleteMany({
      email: email,
    });
    res.json({
      message: "Password changed successfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error changing password",
    });
  }
}

export async function setUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { isDisabled } = req.body;
    await User.findByIdAndUpdate(id, { isDisabled });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
}

export async function getAllUsers(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
}

export async function getUserWithOrders(req, res) {
  try {
    const identifier = req.params.id;

    // If it's a valid MongoDB ID, find by _id
    let user;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier).select("-password");
    }

    // If not found, try using email instead
    if (!user) {
      user = await User.findOne({ email: identifier }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ email: user.email }).sort({
      createdAt: -1,
    });

    res.json({ user, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user profile" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
}
