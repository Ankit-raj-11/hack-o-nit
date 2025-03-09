// /middlewares/checkExistingUser.js

const User = require("../models/user"); // Make sure you have the User model correctly imported

const checkExistingUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { error: "Email already registered" });
    }

    next(); // Proceed to user creation
  } catch (err) {
    res
      .status(500)
      .render("register", { error: "Server error, please try again" });
  }
};

module.exports = checkExistingUser;
