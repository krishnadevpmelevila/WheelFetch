var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
const User = require("../../models/user");
router.get("/login", async (req, res) => {
  return res.render("login");
}
);

router.get("/register", async (req, res) => {
  return res.render("register");
}
);
router.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ name, email, username, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials!" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials!" });
    }

    // Save user information in the session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    // Clear the session cookie
    res.clearCookie("connect.sid"); // This is the default session cookie name
    // Redirect to login or homepage after logout
    res.redirect("/auth/login?logout=success");
  });
});


// Start the server
module.exports = router;