const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, " Password must consist of at least 8 characters"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  age: {
    type: Number,
    min: [0, "Age must be a positive number"],
  },
  bio: {
    type: String,
  },
  photos: [String],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
