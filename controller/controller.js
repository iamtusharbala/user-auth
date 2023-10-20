const User = require("../models/userModel");
const helpers = require("../helpers/helpers");
const bcrypt = require("bcrypt");

exports.userRegistration = async (req, res) => {
  const userIdRequest = await User.findOne({ username: req.body.username });
  console.log(userIdRequest);
  if (!userIdRequest) {
    const { username, password } = req.body;
    const hashedPassword = helpers.generateHash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    User.create(newUser);
    res.status(201).json({
      message: "User created successfully",
    });
  } else {
    res.status(400).json({
      message: "User already exists",
    });
  }
};

exports.userLogin = async (req, res) => {
  const check = await User.findOne({ username: req.body.username });
  if (check) {
    const dbPassword = check.password;
    const match = await bcrypt.compare(req.body.password, dbPassword);
    if (match) {
      req.session.isLoggedIn = true;
      req.session.user = req.body.username;
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  } else {
    console.log("You must be logged in");
    res.redirect("/");
  }
};

exports.isLoggedIn = (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy();
    res.redirect("/");
  }
};

exports.viewDashboard = (req, res) => {
  const userName = req.session.user;
  res.render("dashboard", { userName });
};
