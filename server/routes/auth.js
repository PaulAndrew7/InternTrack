const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Google Drive setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEYFILE,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// Create a user folder in Google Drive
const createUserFolder = async (username) => {
  try {
    const folderMetadata = {
      name: username,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_MAIN_FOLDER],
    };

    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    return folder.data.id;
  } catch (error) {
    console.error("Error creating folder:", error.message);
    return null;
  }
};

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    // Create Google Drive folder
    const folderId = await createUserFolder(username);
    if (!folderId) {
      return res.json({ success: false, message: "Failed to create Google Drive folder!" });
    }

    // Create user
    const newUser = new User({ username, password, role, folderId });
    await newUser.save();

    res.json({ success: true, message: "Registration successful!", folderId });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.json({ success: false, message: "Registration failed!" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("=== Login Attempt ===");
  console.log("Request body:", req.body);
  console.log("Username:", username);
  console.log("Password:", password);

  try {
    // First check if user exists
    const user = await User.findOne({ username });
    console.log("=== Database Query ===");
    console.log("User found:", user ? "Yes" : "No");
    
    if (user) {
      console.log("=== User Details ===");
      console.log("Username:", user.username);
      console.log("Stored password hash:", user.password);
      console.log("Provided password:", password);
      
      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
      
      console.log("User role:", user.role);
      console.log("User folderId:", user.folderId);
    }

    if (user && await bcrypt.compare(password, user.password)) {
      console.log("=== Login Success ===");
      res.json({ 
        success: true, 
        user: {
          username: user.username,
          role: user.role,
          folderId: user.folderId
        }
      });
    } else {
      console.log("=== Login Failure ===");
      console.log("Reason:", user ? "Password mismatch" : "User not found");
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    res.json({ success: false, message: "Login failed!" });
  }
});

module.exports = router;