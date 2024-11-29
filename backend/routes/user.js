import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateToken from "./authRoutes.js";

const router = express.Router();

// Sign in route
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      res.status(400).json({
        message:
          "Invalid username or password. Please enter correct username or password to sign in.",
      });
    }

    bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.name },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, "BookstoreKey", {
          expiresIn: "1d",
        });
        res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
          message: "Signed In Succussfully.",
        });
      } else {
        res.status(400).json({
          message:
            "Invalid username or password. Please enter correct username or password to sign in.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Sign up route
router.post("/sign-up", async (req, res) => {
  try {
    const { name, username, email, password, address } = req.body;

    // check existing username
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername)
      return res.status(400).json({ message: "username already exists." });

    // check existing email
    const exitingEmail = await User.findOne({ email: email });
    if (exitingEmail)
      return res.status(400).json({ message: "email already exists." });

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // create new user
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: hashPassword,
      address: address,
    });

    // save user to database
    await newUser.save();
    return res.status(200).json({ message: "Signed up successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get user
router.get("/user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res
      .status(200)
      .json({ message: "Address has been updated succussfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
