import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

function verifyJWT(req, res, next) {
  const header = req.header("Authorization");
  if (header != null) {
    const token = header.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
      }
    });
  }
  next();
}

export default verifyJWT;
