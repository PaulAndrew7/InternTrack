const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
const upload = multer();
const EXCEL_FILE = "student_data.xlsx"; // Excel file name

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to load Excel data
const loadExcel = () => {
    if (!fs.existsSync(EXCEL_FILE)) return [];
    const workbook = xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};

// Function to save Excel data
const saveExcel = (data) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, EXCEL_FILE);
};

// Function to append new data to Excel
const appendToExcel = (data) => {
    let students = loadExcel();
    students.push(data);
    saveExcel(students);
};

// 📌 API to submit new student details
app.post("/submit", upload.none(), (req, res) => {
    const formData = req.body;
    
    // Structure the data for Excel
    const rowData = {
        "Register No": formData.regno,
        "Name": formData.name,
        "Mobile No": formData.mobile,
        "Section": formData.section,
        "Obtained Internship": formData.internship,
        "Period": formData.period,
        "Start Date": formData.startdate,
        "End Date": formData.enddate,
        "Company Name": formData.company,
        "Placement Source": formData.src,
        "Stipend (Rs.)": formData.stipend,
        "Internship Type": formData.type,
        "Location": formData.location,
        "Offer Letter Submitted": formData.offer ? "Yes" : "No",
        "Completion Certificate": formData.completion ? "Yes" : "No",
        "Internship Report Submitted": formData.report ? "Yes" : "No",
        "Student Feedback Submitted": formData.feedback ? "Yes" : "No",
        "Employer Feedback Submitted": formData.emp ? "Yes" : "No",
    };

    appendToExcel(rowData);
    res.json({ message: "Data saved successfully!" });
});

// 📌 API to fetch student details by Register No
// API to fetch student details by Register Number
app.get("/getStudent/:regno", (req, res) => {
    const regno = req.params.regno;
    const students = loadExcel();
    const student = students.find(s => s["Register No"] === regno);

    if (student) {
        res.json({ success: true, student });
    } else {
        res.json({ success: false, message: "Student not found" });
    }
});

// API to update student details (including checkboxes)
app.post("/updateStudent", (req, res) => {
    const { regno, name, mobile, section, internship, period, startdate, enddate, company, src, stipend, type, location } = req.body;

    let students = loadExcel();
    let studentIndex = students.findIndex(s => s["Register No"] === regno);

    if (studentIndex === -1) {
        return res.json({ success: false, message: "Student not found!" });
    }

    // Update only the logged-in student
    const updatedStudent = {
        "Register No": regno,
        "Name": name,
        "Mobile No": mobile,
        "Section": section,
        "Obtained Internship": internship,
        "Period": period,
        "Start Date": startdate,
        "End Date": enddate,
        "Company Name": company,
        "Placement Source": src,
        "Stipend (Rs.)": stipend,
        "Internship Type": type,
        "Location": location,
        "Offer Letter Submitted": req.body.offer === "true" ? "Yes" : "No",
        "Completion Certificate": req.body.completion === "true" ? "Yes" : "No",
        "Internship Report Submitted": req.body.report === "true" ? "Yes" : "No",
        "Student Feedback Submitted": req.body.feedback === "true" ? "Yes" : "No",
        "Employer Feedback Submitted": req.body.emp === "true" ? "Yes" : "No"
    };

    // Ensure the correct record is updated
    students[studentIndex] = updatedStudent;
    saveExcel(students);

    res.json({ success: true, message: "Student details updated successfully!" });
});




// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
