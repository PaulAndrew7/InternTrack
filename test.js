const { exec } = require("child_process");
const path = require("path");

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

// 📌 Function to classify document type based on extracted text
const classifyDocumentType = (extractedText) => {
    for (const doc of documentTypes) {
        if (doc.keywords.some(keyword => extractedText.toLowerCase().includes(keyword.toLowerCase()))) {
            return doc.type;
        }
    }
    return "Unknown Document";
};

// 📌 Run the extract_text.py script
const extractTextFromPDF = (pdfPath) => {
    return new Promise((resolve, reject) => {
        // Check if the file exists before attempting to process it
        if (!require('fs').existsSync(pdfPath)) {
            return reject(`File not found: ${pdfPath}`);
        }
        
        // Use path.join to ensure proper path formatting for the Python script
        const pythonScript = path.join(__dirname, 'extract_text.py');
        
        // Add timeout and improved error handling
        exec(`python "${pythonScript}" "${pdfPath}"`, { timeout: 60000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Error: ${stderr}`);
                reject(`OCR extraction failed: ${error.message}`);
            } else if (stderr) {
                console.warn(`OCR Warning: ${stderr}`);
                resolve(stdout.trim());
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

// 📌 Main function to extract text and classify document
const main = async () => {
    if (process.argv.length < 3) {
        console.error("❌ Please provide the PDF file path.");
        console.error("Usage: node testWithOCR.js path/to/sample.pdf");
        process.exit(1);
    }

    const pdfPath = path.resolve(process.argv[2]);

    try {
        console.log(`🔍 Extracting text from: ${pdfPath}`);
        const extractedText = await extractTextFromPDF(pdfPath);
        
        console.log("\n📝 Extracted Text:\n", extractedText);
        
        const docType = classifyDocumentType(extractedText);
        console.log(`\n📂 Classified Document Type: ${docType}`);
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

// Run the script
main();
