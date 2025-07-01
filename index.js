const express = require("express");

// Initialize app
const app = express();
const PORT = 3000 || require("./constants").PORT;

// Importing routes and utility functions
const index = require("./routes/index.routes");
const getLocalIP = require("./utils/network");
const downloadRouter = require("./routes/download.routes");
const fileHandlingRouter = require("./routes/fileHandling.routes");

// Serving static files
app.use(express.static("public"));

// Defining routes
app.use("/", index);
app.use("/download", downloadRouter);
app.use("/files", fileHandlingRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://${getLocalIP()}:${PORT}/`);
});
