const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const auth = require("../middleware/auth");

// Set up multer for file uploads
const upload = multer({ dest: path.join(__dirname, "../../uploads/") });

// Google Drive setup
const googleAuth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEYFILE,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", googleAuth });

// @route   POST api/drive/upload-excel
// @desc    Upload Excel file to Google Drive
// @access  Private (Teacher only)
router.post("/upload-excel", [auth, upload.single("file")], async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.GOOGLE_DRIVE_MAIN_FOLDER],
    };

    const media = {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    // Delete temp file after upload
    fs.unlinkSync(req.file.path);

    res.json({ success: true, fileId: file.data.id, message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "File upload failed", error: error.message });
  }
});

// @route   POST api/drive/create-folder
// @desc    Create a new folder in Google Drive
// @access  Private (Teacher only)
router.post("/create-folder", auth, async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const folderMetadata = {
      name: req.body.folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_MAIN_FOLDER],
    };

    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    res.json({ success: true, folderId: folder.data.id, message: "Folder created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create folder", error: error.message });
  }
});

module.exports = router;