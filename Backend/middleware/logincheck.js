const User = require("./models/user");
const bcrypt = require("bcrypt");

const checkemail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).send("Error checking email");
  }
};

const checkpassword = async (req, res, next) => {
  try {
    const isMatch = await bcrypt.compare(req.body.password, req.user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    next();
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).send("Error checking password");
  }
};

module.exports = { checkemail, checkpassword };
