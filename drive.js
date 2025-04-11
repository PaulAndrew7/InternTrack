const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Load Google Drive Credentials
const KEYFILE_PATH = "d:/intern_web/intern-track.json";  // Update with your JSON key file
const FOLDER_ID = "1bXclhLbo5IXFXtBOhGKm2Dxbqg2UG6RY"; // Updated Google Drive folder ID

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// 📌 API to create a new folder in Google Drive
app.post("/createFolder", async (req, res) => {
    try {
        const folderMetadata = {
            name: req.body.folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [FOLDER_ID], // Store it inside the main folder
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: "id",
        });

        res.json({ success: true, folderId: folder.data.id, message: "Folder created successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create folder", error: error.message });
    }
});

// 📌 API to upload an Excel file to Google Drive
app.post("/uploadExcel", upload.single("file"), async (req, res) => {
    try {
        const fileMetadata = {
            name: req.file.originalname,
            parents: [FOLDER_ID], // Store inside Google Drive folder
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

        res.json({ success: true, fileId: file.data.id, message: "File uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "File upload failed", error: error.message });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});