import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

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

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to create a user",
    });
  }

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
