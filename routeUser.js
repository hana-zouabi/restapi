const express = require("express");
const bcrypt = require("bcrypt");
const Declaration = require("../Models/declarations");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Declaration.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Declaration.create({
      name,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully!", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Declaration.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password!" });

    const token = jwt.sign({ email: user.email }, process.env.privateKey, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
