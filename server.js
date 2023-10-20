const express = require("express");
const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 3000;
const DB = "mongodb://127.0.0.1:27017/user-auth";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected succesfully!!"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Listening on ${port}`));
