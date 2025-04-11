const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");
const mongoose = require("mongoose");

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

// MongoDB user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    folderId: { type: String, required: true }
});

const User = mongoose.model("users", userSchema);

const KEYFILE_PATH = "d:/intern_web/intern-track.json"; 
const MAIN_FOLDER_ID = "1bXclhLbo5IXFXtBOhGKm2Dxbqg2UG6RY";
// Google Drive authentication
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// 📌 Function to create a user folder in Google Drive
const createUserFolder = async (username) => {
    try {
        const folderMetadata = {
            name: username,
            mimeType: "application/vnd.google-apps.folder",
            parents: [MAIN_FOLDER_ID], // Store inside the main folder
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: "id",
        });

        return folder.data.id; // Return the folder ID
    } catch (error) {
        console.error("Error creating folder:", error.message);
        return null;
    }
};

// Register endpoint
app.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists!" });
        }

        const folderId = await createUserFolder(username);
        if (!folderId) {
            return res.json({ success: false, message: "Failed to create Google Drive folder!" });
        }

        const newUser = new User({ username, password, role, folderId });
        await newUser.save();

        res.json({ success: true, message: "Registration successful!", folderId });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.json({ success: false, message: "Registration failed!" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, role: user.role, folderId: user.folderId });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        res.json({ success: false, message: "Login failed!" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
