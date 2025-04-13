const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const filePath = path.join('d:/intern_web/student_data.xlsx');

// Helper function to find internship index by register number and company
const findInternshipIndex = (data, registerNo, companyName) => {
    return data.findIndex(item => 
        item['Register No'] === registerNo && 
        item['Company Name'] === companyName
    );
};

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

// @route   PUT api/excel/update/:id
// @desc    Update internship by ID
// @access  Public (should be secured in production)
router.put('/update/:id', (req, res) => {
    try {
      console.log(`Received update request for ID: ${req.params.id}`);
      console.log('Request body:', req.body);
      
      const id = parseInt(req.params.id);
      const updatedData = req.body;
      
      // Ensure we have the required data
      if (!updatedData || !updatedData['Register No']) {
        return res.status(400).json({ success: false, message: 'Missing required student data' });
      }
  
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid internship ID' });
      }
      
      // Check if Excel file exists
      if (!fs.existsSync(filePath)) {
        console.error('Excel file not found at:', filePath);
        return res.status(404).json({ success: false, message: 'Excel file not found' });
      }
  
      // Load the workbook and worksheet
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert sheet to JSON array
      const data = xlsx.utils.sheet_to_json(worksheet);
      console.log(`Total records in Excel: ${data.length}`);
  
      // Get all internships for this user
      const studentInternships = data.filter(row => row['Register No'] === updatedData['Register No']);
      console.log(`Found ${studentInternships.length} internships for student ${updatedData['Register No']}`);
  
      if (!studentInternships.length || !studentInternships[id]) {
        return res.status(404).json({ success: false, message: 'Internship not found for this user' });
      }
  
      // Find the index of this internship in the full data
      let internshipIndexInSheet = -1;
      let matchCount = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i]['Register No'] === updatedData['Register No']) {
          matchCount++;
          if (matchCount === id) {
            internshipIndexInSheet = i;
            break;
          }
        }
      }
  
      if (internshipIndexInSheet === -1) {
        return res.status(404).json({ success: false, message: 'Internship not found in sheet' });
      }
      
      console.log(`Found internship at index ${internshipIndexInSheet} in the Excel sheet`);
  
      // Replace the internship data
      data[internshipIndexInSheet] = updatedData;
  
      // Convert JSON back to worksheet
      const updatedSheet = xlsx.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = updatedSheet;
  
      // Write back to file
      xlsx.writeFile(workbook, filePath);
  
      return res.json({ success: true, message: 'Internship updated successfully' });
  
    } catch (error) {
      console.error('Update Error:', error);
      return res.status(500).json({ success: false, message: 'Server error during update' });
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