const User = require("../models/user"); // Adjust the path to match the correct file name

const checkemail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Email not found");
  }
  next();
};

const checkpassword = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.password === password) {
    next();
  } else {
    return res.status(400).send("Invalid password");
  }
};

module.exports = { checkemail, checkpassword };
