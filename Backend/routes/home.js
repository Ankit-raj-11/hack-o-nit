const express = require("express");
const router = express.Router();
const Room = require("../models/room");

router.get("/home", async (req, res) => {
  const user = req.user; // Assuming user is attached to the request object
  if (!user) {
    return res.status(401).send("User not authenticated");
  }
  res.render("home", { user });
});

router.get("/discussion0", async (req, res) => {
  const rooms = await Room.find({});
  res.render("discussion0", { rooms });
});

module.exports = router;
