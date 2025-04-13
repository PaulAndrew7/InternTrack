const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const filePath = 'd:/intern_web/student_data.xlsx'

// Endpoint to read Excel and send data as JSON
router.get('/data', (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.log('Excel file not found at:', filePath);
            return res.status(404).json({ 
                error: "Excel file not found",
                message: "Please upload an Excel file first",
                path: filePath
            });
        }

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Read first sheet
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        console.log('Excel file read successfully. Number of records:', data.length);
        res.json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).json({ 
            error: "Error reading Excel file",
            message: error.message
        });
    }
});

// Endpoint to upload Excel file
router.post('/upload', (req, res) => {
    try {
        // TODO: Implement file upload logic
        res.status(501).json({ 
            error: "Not implemented",
            message: "Excel file upload endpoint not yet implemented"
        });
    } catch (error) {
        console.error('Error uploading Excel file:', error);
        res.status(500).json({ 
            error: "Error uploading Excel file",
            message: error.message
        });
    }
});

module.exports = router; 