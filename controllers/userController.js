import User from "../models/user.js";
import Order from "../models/order.js";
import Review from "../models/review.js";
import Wishlist from "../models/wishlist.js";
import Notification from "../models/notifications.js";
import OTP from "../models/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
// Load environment variables from .env file
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
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
    phone: req.body.phone,
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

export function sendOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(10000 + Math.random() * 90000);

  const message = {
    from: `"Crystal Beauty Clear" <${process.env.EMAIL}>`,
    to: email,
    subject: "🔐 Reset Your Password - OTP Inside!",
    html: `
    <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #1a202c; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Crystal Beauty</h1>
        <p style="margin: 0; font-size: 16px;">Secure Password Reset</p>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #333;">Hey beautiful 👋,</p>
        <p style="font-size: 16px; color: #444;">
          You (or someone else) requested to reset your password. Use the OTP below to verify your identity:
        </p>

        <div style="margin: 30px auto; text-align: center;">
          <span style="display: inline-block; background: #edf2f7; color: #2d3748; font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 15px 30px; border-radius: 8px; border: 2px dashed #4A5568;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 16px; color: #555;">
          This OTP is valid for <strong>5 minutes</strong>. Please don't share it with anyone.
        </p>

        <p style="font-size: 14px; color: #888;">
          If you didn’t request a password reset, please ignore this email or contact support.
        </p>

        <div style="margin-top: 40px; text-align: center;">
          <a href="https://yourfrontenddomain.com/reset-password" style="background-color: #1a202c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Reset Password Now
          </a>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
        © ${new Date().getFullYear()} Crystal Beauty. All rights reserved.
      </div>
    </div>
  `,
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
  const message = {
    from: `"Crystal Beauty Clear" <${process.env.EMAIL}>`,
    to: email,
    subject: "🔒 Your Password Has Been Changed",
    html: `
    <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
      
      <div style="background-color: #1a202c; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0;">Crystal Beauty</h1>
        <p style="margin: 0; font-size: 16px;">Security Notification</p>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 18px; color: #2d3748;">Hi there 👋,</p>

        <p style="font-size: 16px; color: #4a5568;">
          This is a confirmation that your password was successfully changed on your <strong>Crystal Beauty</strong> account.
        </p>

        <div style="margin: 20px 0; background-color: #f0f4f8; padding: 20px; border-radius: 8px; color: #2d3748; font-size: 15px;">
          ✅ <strong>Password Updated:</strong> ${new Date().toLocaleString()}
        </div>

        <p style="font-size: 15px; color: #4a5568;">
          If this wasn’t you, please reset your password immediately and contact our support team.
        </p>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://yourfrontenddomain.com/contact-support" style="background-color: #1a202c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Contact Support
          </a>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
        If you have questions, reply to this email or visit our <a href="https://celadon-twilight-9bf0e7.netlify.app/contact" style="color: #3182ce;">Help Center</a>.<br/>
        © ${new Date().getFullYear()} Crystal Beauty. All rights reserved.
      </div>
    </div>
  `,
  };
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
    transport.sendMail(message, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error sending confirmation email",
        });
      } else {
        return res.json({
          message: "Password changed successfully",
        });
      }
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

export async function updateUser(req, res) {
  try {
    const { firstName, lastName, phone, defaultAddressIndex } = req.body;

    if (!req.user || !req.user.email) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update basic user info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    // ✅ Handle default address update
    if (
      typeof defaultAddressIndex === "number" &&
      user.savedAddresses &&
      user.savedAddresses.length > defaultAddressIndex
    ) {
      // Clear all previous defaults
      user.savedAddresses.forEach((addr, i) => {
        addr.isDefault = i === defaultAddressIndex;
      });
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating user" });
  }
}

export async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "Please login to access this resource",
    });
  }

  try {
    const freshUser = await User.findOne({ email: req.user.email }).select(
      "-password" // exclude sensitive fields
    );

    if (!freshUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: freshUser });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deleteOrders = await Order.deleteMany({
      email: req.user.email,
    });
    const deleteWishlists = await Wishlist.deleteMany({
      userEmail: req.user.email,
    });
    const deleteReviews = await Review.deleteMany({
      userId: req.user.email,
    });
    const deleteNotifications = await Notification.deleteMany({
      UserEmail: req.user.email,
    });
    const deleteOTP = await OTP.deleteMany({
      email: req.user.email,
    });
    const deleteUser = await User.findOneAndDelete({
      email: req.user.email,
    });

    if (deleteUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
}

// In your controller
export async function updateAddress(req, res) {
  const { addressId } = req.params;
  const { fullName, address, phone } = req.body;

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressToUpdate = user.savedAddresses.id(addressId);
    if (!addressToUpdate)
      return res.status(404).json({ message: "Address not found" });

    addressToUpdate.fullName = fullName;
    addressToUpdate.address = address;
    addressToUpdate.phone = phone;

    await user.save();

    return res.json({ message: "Address updated successfully", user });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: "Failed to update address" });
  }
}

// POST /api/user/add-address
export async function addAddress(req, res) {
  const { fullName, phone, address } = req.body;

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedAddresses.push({ fullName, phone, address });
    await user.save();

    return res.json({ message: "Address added successfully", user });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
}

// DELETE /api/user/address/:addressId
export async function deleteAddress(req, res) {
  const { addressId } = req.params;

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedAddresses = user.savedAddresses.filter(
      (addr) => addr._id.toString() !== addressId
    );
    await user.save();

    return res.json({ message: "Address deleted", user });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ message: "Failed to delete address" });
  }
}
