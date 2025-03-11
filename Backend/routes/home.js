// ...existing code...
router.get("/home", (req, res) => {
  const user = req.user; // Assuming user is attached to the request object
  if (!user) {
    return res.status(401).send("User not authenticated");
  }
  res.render("home", { user });
});
// ...existing code...
