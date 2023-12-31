const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Sequelize, Token } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");
require("dotenv").config();

router.post("/register", async (req, res) => {
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i)
      .min(3)
      .max(50)
      .required(),
    email: yup.string().trim().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required(),
  });
  try {
    await validationSchema.validate(data, { abortEarly: false, strict: true });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
    return;
  }

  // Trim string values
  data.name = data.name.trim();
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();

  // Check email
  let user = await User.findOne({
    where: { email: data.email },
  });
  if (user) {
    res.status(400).json({ message: "Email already exists." });
    return;
  }

  // Hash passowrd
  data.password = await bcrypt.hash(data.password, 10);
  // Create user
  let result = await User.create(data);
  res.json(result);
});

router.post("/login", async (req, res) => {
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object().shape({
    email: yup.string().trim().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required(),
  });
  try {
    await validationSchema.validate(data, { abortEarly: false, strict: true });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
    return;
  }

  // Trim string values
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();

  // Check email and password
  let errorMsg = "Email or password is not correct.";
  let user = await User.findOne({
    where: { email: data.email },
  });
  if (!user) {
    res.status(400).json({ message: errorMsg });
    return;
  }
  let match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    res.status(400).json({ message: errorMsg });
    return;
  }

  // Return user info
  let userInfo = {
    id: user.id,
    email: user.email,
    name: user.name,
    admin: user.admin,
  };
  let accessToken = sign(userInfo, process.env.APP_SECRET, {
    expiresIn: "30d",
  });
  res.json({
    accessToken: accessToken,
    user: userInfo,
  });
});

router.put("/update/:id", async (req, res) => {
  console.log("method called");
  let id = req.params.id;
  let data = req.body;
  // Check id not found
  let user = await User.findByPk(id);
  // Validate request body
  let validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i)
      .min(3)
      .max(50)
      .required(),
    email: yup.string().trim().email().max(50).required(),
  });
  try {
    await validationSchema.validate(data, { abortEarly: false });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errors: err.errors });
    return;
  }
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Update user data
  if (data.filename) {
    // Update imageFile if data.filename is provided
    user.imageFile = data.filename;
  }
  user.name = data.name;
  user.email = data.email;

  try {
    await user.save();
    res.json({
      message: "User was updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `An error occurred while updating user with id ${id}.`,
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  let userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    admin: req.user.admin,
  };
  res.json({
    user: userInfo,
  });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let user = await User.findByPk(id);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  let num = await User.destroy({
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "User was deleted successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot delete user with id ${id}.`,
    });
  }
});

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Sequelize.Op.or] = [
      { name: { [Sequelize.Op.like]: `%${search}%` } },
      { email: { [Sequelize.Op.like]: `%${search}%` } },
    ];
  }

  let list = await User.findAll({
    where: condition,
    order: [["createdAt", "ASC"]],
  });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let user = await User.findByPk(id);
  // Check id not found
  if (!user) {
    res.sendStatus(404);
    return;
  }
  res.json(user);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'totallyrealrental@gmail.com',
    pass: 'tnozgoqkkzfnfier'
  },
});

const generateToken = () => crypto.randomBytes(20).toString("hex");

router.post("/forgotpassword/:email", async (req, res) => {
  const email = req.params.email;
  try {
    // Find the user based on the email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token and set the expiration time (1 hour in this case)
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the reset token in the database
    await Token.create({
      token,
      email,
      expiresAt,
    });
    // Send password reset email
    transporter.sendMail({
      from: 'totallyrealrental@gmail.com',
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: http://localhost:3000/resetpassword/${token}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    // Retrieve the token data from the database
    const tokenData = await Token.findOne({
      where: { token: token },
    });

    if (!tokenData || new Date() > tokenData.expiresAt) {
      console.log("Expired token")
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    const { email } = tokenData;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    const validationSchema = yup.object().shape({
      password: yup.string().trim().min(8).max(50).required(),
    });

    try {
      // Validate the password against the validation schema
      await validationSchema.validate(
        { password },
        { abortEarly: false, strict: true }
      );
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      await Token.destroy({ where: { token: token } });
      res.json({ message: "Password reset successful" });
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
