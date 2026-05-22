const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// REGISTER
router.post("/register", async (req, res) => {
  console.log("REGISTER ROUTE HIT");

  try {
    const {
      username,
      email,
      password,
      mobile,
      dob,
      gender,
    } = req.body;

    // CHECK EMPTY
    if (
      !username ||
      !email ||
      !password ||
      !mobile ||
      !dob ||
      !gender
    ) {
      return res
        .status(400)
        .json("All fields are required");
    }

    // CHECK USER
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json("User already exists");
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      dob,
      gender,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message:
        "Registration successful",
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {
    const { email, password } = req.body;

    // CHECK USER
    const user =
      await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json("User not found");
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res
        .status(400)
        .json("Wrong password");
    }

    // TOKEN
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    // RESPONSE
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;