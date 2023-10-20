const express = require("express");
const mongoose = require("mongoose");
const app = express();
const logger = require("morgan");
const session = require("express-session");
const { engine } = require("express-handlebars");
const User = require("./models/userModel");
const helpers = require("./helpers/helpers");
const controller = require("./controller/controller");
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

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

//View dashboard only when logged in
app.get("/dashboard", helpers.isAuth, controller.viewDashboard);
app.post("/register", controller.userRegistration);
app.post("/login", controller.userLogin);
app.post("/logout", controller.isLoggedIn);
module.exports = app;
