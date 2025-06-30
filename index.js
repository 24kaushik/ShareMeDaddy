const express = require("express");

// Initialize app
const app = express();
const PORT = 3000;

// Importing routes and utility functions
const router = require("./routes/router");
const getLocalIP = require("./utils/network");
const downloadRouter = require("./routes/download.routes");

// Serving static files
app.use(express.static("public"));

// Defining routes
app.use("/", router);
app.use("/download", downloadRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://${getLocalIP()}:${PORT}/`);
});
