const express = require("express");
const bcrypt = require("bcrypt");
const Declaration = require("../Models/declarations");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findDeclaration = await Declaration.findOne({ email });
    if (findDeclaration) {
      return res.status(409).json({ message: "This email already exists!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    await Declaration.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Declaration.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password!" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.privateKey,
      {
        algorithm: "HS256",
        expiresIn: "30d",
      },
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
