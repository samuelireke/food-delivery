import "dotenv/config";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// jwt token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // checking if user already exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format!. Please enter valid email",
      });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, including a mix of uppercase, lowercase, numbers, and symbols.",
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { loginUser, registerUser };
