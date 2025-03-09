const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session"); 
const { checkemail, checkpassword } = require("./middlewares/logincheck");
const User = require("./models/user");
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
); // Add this line
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Frontend/pages"));

// Mongoose connection
mongoose
  .connect("mongodb://localhost:27017/gang", {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("page0");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/notes", (req, res) => {
  res.render("notes");
});

app.get("/discussion", (req, res) => {
  res.render("discussion");
});

app.get("/announcement", (req, res) => {
  res.render("announcement");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/page0");
  });
});

app.get("/page0", (req, res) => {
  res.render("page0");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password, gender, age, bio } = req.body;
  try {
    const user = new User({ username, email, password, gender, age, bio });
    await user.save();
    res.send(
      "<script>alert('Registration successful'); window.location.href='/login';</script>"
    );
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

// Login route
app.post("/login", checkemail, checkpassword, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      req.session.userId = user._id;
      res.redirect("/home");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    throw err;
  }
});
