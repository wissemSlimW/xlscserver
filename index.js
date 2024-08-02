const express = require("express");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

// Function to read Excel file and convert to JSON
const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const headers = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
  });
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  return jsonData;
};
const filePath = path.join(__dirname, "FMSCA_records.xlsx");
let data = [];
if (fs.existsSync(filePath)) {
  data = readExcelFile(filePath);
}
// Endpoint to get Excel data
app.get("/excel-data", (req, res) => {
  if (fs.existsSync(filePath)) {
    res.json(data);
  } else {
    res.status(404).send("File not found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running `);
});
