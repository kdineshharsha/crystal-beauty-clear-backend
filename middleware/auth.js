import jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
  const header = req.header("Authorization");
  if (header != null) {
    const token = header.replace("Bearer ", "");
    jwt.verify(token, "random456", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
      }
    });
  }
  next();
}
export default verifyJWT;
