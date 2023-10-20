const bcrypt = require("bcrypt");
//Function to generate the hash
exports.generateHash = (password) => {
  return bcrypt.hashSync(password, 10);
};

//Function to check if current session is logged in
exports.isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
