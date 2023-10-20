const express = require("express");
const mongoose = require("mongoose");
const app = express();
const logger = require("morgan");
const session = require("express-session");
const { engine } = require("express-handlebars");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
app.use(logger("dev"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    maxAge: 3000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
app.set("views", `${__dirname}/views`);
app.set("view engine", "hbs");

const generateHash = (password) => {
  return bcrypt.hashSync(password, 10);
};

//Function to check if current session is logged in
const isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// User registration
app.post("/register", async (req, res) => {
  const userIdRequest = await User.findOne({ username: req.body.username });
  console.log(userIdRequest);
  if (!userIdRequest) {
    const { username, password } = req.body;
    const hashedPassword = generateHash(password);
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
});

//View dashboard only when logged in
app.get("/dashboard", isAuth, (req, res) => {
  const userName = req.session.user;
  res.render("dashboard", { userName });
});

//Login check
app.post("/login", async (req, res) => {
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
});

app.post("/logout", (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy();
    res.redirect("/");
  }
});
module.exports = app;
