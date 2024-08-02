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
const filePath = path.join(__dirname, "../FMSCA_records.xlsx");
let data = [];
if (fs.existsSync(filePath)) {
  data = readExcelFile(filePath);
}
// Endpoint to get Excel data
app.get("/", (req, res) => {
  const {
    page = 0,
    limit = 100,
    created_dt,
    data_source_modified_dt,
    entity_type,
    operating_status,
    legal_name,
    dba_name,
    physical_address,
    phone,
    usdot_number,
    mc_mx_ff_number,
    power_units,
    out_of_service_date,
  } = req.query;
  const filters = {
    created_dt,
    data_source_modified_dt,
    entity_type,
    operating_status,
    legal_name,
    dba_name,
    physical_address,
    phone,
    usdot_number,
    mc_mx_ff_number,
    power_units,
    out_of_service_date,
  };
  const filterItems = Object.keys(filters).filter(
    (filter) => !!filters[filter]
  );
  console.log(filters, filterItems);
  const filteredData = filterItems.length
    ? data.filter((item) =>
        filterItems.every((filter) =>
          String(item[filter])
            .toLowerCase()
            .includes(String(filters[filter]).toLowerCase() || "")
        )
      )
    : data;
  res.json({
    total: filteredData.length,
    data: filteredData.slice(+page * +limit, (+page + 1) * +limit),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running `);
});
