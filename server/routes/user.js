const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
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
  console.log("method called")
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
  // Check request user id
  // let userId = req.user.id;
  // if (user.userId != userId) {
  //   res.sendStatus(403);
  //   return;
  // }
  if (!user) {
    res.sendStatus(404);
    return;
  }
  let num = await User.update(data, {
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "User was updated successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot update user with id ${id}.`,
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  let userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
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
      where: { id: id }
  })
  if (num == 1) {
      res.json({
          message: "User was deleted successfully."
      });
  }
  else {
      res.status(400).json({
          message: `Cannot delete user with id ${id}.`
      });
  }
});

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
      condition[Sequelize.Op.or] = [
          { name: { [Sequelize.Op.like]: `%${search}%` } },
          { email: { [Sequelize.Op.like]: `%${search}%` } }
      ];
  }

  let list = await User.findAll({
      where: condition,
      order: [['createdAt', 'ASC']]
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

module.exports = router;
