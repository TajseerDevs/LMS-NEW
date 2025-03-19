const fs = require("fs");

const readLogsFromFile = () => {
    try {
      if (fs.existsSync(logsFilePath)) {
        const logsData = fs.readFileSync(logsFilePath, "utf8");
        return logsData ? JSON.parse(logsData) : {}; // Return empty object if the file is empty
      } else {
        return {}; // Return empty object if file doesn't exist
      }
    } catch (err) {
      console.error("Error reading logs:", err.message);
      return {}; // Return empty object if there's an error
    }
};




// Helper function to write logs to the JSON file
const writeLogsToFile = (logs) => {
  try {
    fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
    console.log("Logs saved to file:", logs);
  } catch (err) {
    console.error("Error writing logs to file:", err.message);
  }
};



module.exports = {readLogsFromFile , writeLogsToFile}
