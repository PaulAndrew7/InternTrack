const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { google } = require("googleapis");
const { exec } = require("child_process");
const path = require("path");
const mongoose = require("mongoose"); // <-- MongoDB
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🎯 MongoDB Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    folderId: String
});
const User = mongoose.model("users", userSchema);

// 📌 Google Drive API Setup
const KEYFILE_PATH = "d:/intern_web/intern-track.json";
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// 📌 Document classification keywords
const documentTypes = [
    { type: "Permission Letter", keywords: ["Permission Letter"] },
    { type: "Offer Letter", keywords: ["Offer Letter"] },
    { type: "Completion Certificate", keywords: ["Completion Certificate"] },
    { type: "Student Feedback", keywords: ["Student Feedback"] },
    { type: "Employee Feedback", keywords: ["Employee Feedback"] },
    { type: "Internship Report", keywords: ["Internship Report"] },
    { type: "Resume", keywords: ["Resume", "Curriculum Vitae", "CV"] },
];

// 📌 OCR: Extract text using Python
const extractTextFromDocument = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`python extract_text.py "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Error: ${stderr}`);
                reject("OCR extraction failed");
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

// 📌 Classify document type
const classifyDocumentType = (extractedText) => {
    for (const doc of documentTypes) {
        if (doc.keywords.some(keyword => extractedText.toLowerCase().includes(keyword.toLowerCase()))) {
            return doc.type;
        }
    }
    return "Unknown Document";
};

// 📤 Upload endpoint
app.post("/uploadDocuments", upload.array("files"), async (req, res) => {
    try {
        const username = req.body.username;
        if (!username) return res.status(400).json({ success: false, message: "Username is required!" });

        // ✅ Fetch folder ID from MongoDB
        const user = await User.findOne({ username });
        if (!user || !user.folderId) {
            return res.status(400).json({ success: false, message: "User folder not found!" });
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

        res.json({ success: true, uploadedFiles, message: "Files uploaded successfully!" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "File upload failed", error: error.message });
    }
});

// 🚀 Start server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
