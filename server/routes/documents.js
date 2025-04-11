const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { exec } = require("child_process");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Set up multer for file uploads
const upload = multer({ dest: path.join(__dirname, "../../uploads/") });

// Google Drive setup
const googleAuth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_KEYFILE,
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", googleAuth });

// Document classification keywords
const documentTypes = [
  { type: "Permission Letter", keywords: ["Permission Letter"] },
  { type: "Offer Letter", keywords: ["Offer Letter"] },
  { type: "Completion Certificate", keywords: ["Completion Certificate"] },
  { type: "Student Feedback", keywords: ["Student Feedback"] },
  { type: "Employee Feedback", keywords: ["Employee Feedback"] },
  { type: "Internship Report", keywords: ["Internship Report"] },
  { type: "Resume", keywords: ["Resume", "Curriculum Vitae", "CV"] },
];

// Extract text using Python script
const extractTextFromDocument = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${path.join(__dirname, "../scripts/extract_text.py")} "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`OCR Error: ${stderr}`);
        reject("OCR extraction failed");
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

// Classify document type
const classifyDocumentType = (extractedText) => {
  for (const doc of documentTypes) {
    if (doc.keywords.some(keyword => extractedText.toLowerCase().includes(keyword.toLowerCase()))) {
      return doc.type;
    }
  }
  return "Unknown Document";
};

// @route   POST api/documents/upload
// @desc    Upload documents to Google Drive
// @access  Private
router.post("/upload", [auth, upload.array("files")], async (req, res) => {
  try {
    const username = req.user.username;
    
    // Get user's folder ID
    const user = await User.findOne({ username });
    if (!user || !user.folderId) {
      return res.status(400).json({ success: false, message: "User folder not found" });
    }
    
    const folderId = user.folderId;
    const regSuffix = username.slice(-4);
    
    let uploadedFiles = [];
    
    for (const file of req.files) {
      const filePath = path.resolve(file.path);
      let extractedText = "";
      
      try {
        extractedText = await extractTextFromDocument(filePath);
      } catch (err) {
        console.error(`Text extraction failed for ${file.originalname}:`, err);
      }
      
      let docType = classifyDocumentType(extractedText);
      let extension = path.extname(file.originalname);
      let renamedFile = `${regSuffix}-${docType}${extension}`;
      
      const fileMetadata = {
        name: renamedFile,
        parents: [folderId],
      };
      
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(filePath),
      };
      
      const uploadedFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
      
      uploadedFiles.push({ fileId: uploadedFile.data.id, name: renamedFile });
      fs.unlinkSync(file.path); // Clean up
    }
    
    res.json({ success: true, uploadedFiles, message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "File upload failed", error: error.message });
  }
});

module.exports = router;