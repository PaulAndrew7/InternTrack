const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const User = require("../models/User");

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
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create Google Drive folder
    const folderId = await createUserFolder(username);
    if (!folderId) {
      return res.status(500).json({ success: false, message: "Failed to create Google Drive folder" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      username,
      password: hashedPassword,
      role,
      folderId
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true, 
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            folderId: user.folderId
          }
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token, user: payload.user });
      }
    );
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;