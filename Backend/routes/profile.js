const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/uploads");
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG files are allowed"), false);
  }
};

const uploads = multer({ storage, fileFilter }).array("photos", 10); // Update to handle multiple files

// Route to get user profile details
router.get("/profile", (req, res) => {
  const user = req.user; // Assuming user is attached to the request object
  res.render("profile", { user });
});

// Route to render edit profile page
router.get("/edit-profile", (req, res) => {
  const user = req.user; // Assuming user is attached to the request object
  res.render("edit-profile", { user });
});

// Route to edit user profile details
router.post("/edit-profile", uploads, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.email = req.body.email || user.email;

    // Delete old photos
    user.photos.forEach((photo) => {
      const photoPath = path.join(__dirname, "../../public", photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    });

    // Clear old photos array
    user.photos = [];

    // Add new photos
    if (req.files) {
      req.files.forEach((file) => {
        user.photos.push(`/uploads/${file.filename}`);
      });
    }

    await user.save();
    res.redirect("/home");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
