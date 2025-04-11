const express = require("express");
const cors = require("cors");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());

const filePath = "d:/intern_web/student_data.xlsx";

// Endpoint to read Excel and send data as JSON
app.get("/getExcelData", (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Read first sheet
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        res.json(data); // Send JSON data
    } catch (error) {
        res.status(500).json({ error: "Error reading Excel file" });
    }
});

// Start server
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
