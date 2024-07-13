import "dotenv/config";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied! Please login." });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error_name: "TokenExpiredError",
        message: "Your session has expired. Please log in again.",
      });
    }
    console.log(error);
    res.status(500).json({ success: false, message: "Authentication Error " });
  }
};

export default authMiddleware;
