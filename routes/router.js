const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const sharedFolder = path.join(__dirname, "..", "shared");
const layout = require("../views/layout");

// Route to serve the main page with file links
router.get("/", (req, res) => {
  // Read the shared folder to get the list of files and directories
  fs.readdir(sharedFolder, (err, files) => {
    if (err) return res.status(500).send("Unable to read directory");

    // Filter out the .gitkeep file and create links for each file/directory
    // Directories will have a download link that zips the contents
    let fileLinks = files
      .filter((file) => file !== ".gitkeep")
      .map((file) => {
        const filePath = path.join(sharedFolder, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        const folderIcon = "📁";
        const fileIcon = "📄";

        if (isDirectory) {
          return `<div class="file-item folder">${folderIcon} <a href="/download/dir/${file}">${file} (Download Zipped)</a></div>`;
        } else {
          return `<div class="file-item">${fileIcon} <a href="/download/file/${file}">${file}</a></div>`;
        }
      })
      .join("");

    // Send the HTML response with the file links
    res.send(layout("Share Me Daddy", `${fileLinks}`));
  });
});

module.exports = router;
