const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Load Google Drive Credentials
const KEYFILE_PATH = "d:/intern_web/intern-track.json"; // Replace with actual JSON key file path
const USERS_FILE = "users.json"; // File storing registered users and their folder IDs

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// 📌 Function to get the user's folder ID from `users.json`
const getUserFolderId = (username) => {
    if (!fs.existsSync(USERS_FILE)) return null;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    
    const user = users.find(user => user.username === username);
    return user ? user.folderId : null;
};

// 📌 API to upload multiple files to the logged-in student's Google Drive folder
app.post("/uploadDocuments", upload.array("files"), async (req, res) => {
    try {
        const username = req.body.username; // Get the logged-in student's register number
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required!" });
        }

        // Extract last 4 digits of register number
        const regSuffix = username.slice(-4);

        // Get folder ID for the logged-in user
        const folderId = getUserFolderId(username);
        if (!folderId) {
            return res.status(400).json({ success: false, message: "User folder not found!" });
        }

        let uploadedFiles = [];

        for (const file of req.files) {
            let originalName = file.originalname;
            let extension = originalName.substring(originalName.lastIndexOf(".")); // Get file extension

            // Determine the document type from filename (Example: "Permission Letter.pdf" → "Permission Letter")
            let docType = originalName.replace(extension, "").trim(); 

            // Format: "last-4-digits-of-regno - document-type"
            let renamedFile = `${regSuffix}-${docType}${extension}`;

            const fileMetadata = {
                name: renamedFile, // Use the new name
                parents: [folderId], // Upload into the user's specific folder
            };

            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            };

            const uploadedFile = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: "id",
            });

            uploadedFiles.push({ fileId: uploadedFile.data.id, name: renamedFile });

            // Delete temp file after upload
            fs.unlinkSync(file.path);
        }

        res.json({ success: true, uploadedFiles, message: "Files uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "File upload failed", error: error.message });
    }
});

// Start server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
