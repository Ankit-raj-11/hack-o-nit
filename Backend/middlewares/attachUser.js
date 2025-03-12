const User = require("../models/user");

const attachUserToRequest = async (req, res, next) => {
  if (req.session.userId) {
    req.user = await User.findById(req.session.userId);
  }
  next();
};

module.exports = { attachUserToRequest };
