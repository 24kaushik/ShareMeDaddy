const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const router = express.Router();

const sharedFolder = path.join(__dirname, "..", "shared");

// Download folder as a zip file
router.get("/dir/:folder", (req, res) => {
  const folderPath = path.join(sharedFolder, req.params.folder);
  fs.stat(folderPath, (err, stats) => {
    if (err || !stats.isDirectory())
      return res.status(404).send("Folder not found.");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.folder}.zip"`
    );
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
  });
});

// Download individual file
router.get("/file/:file", (req, res) => {
  const filePath = path.join(sharedFolder, req.params.file);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) return res.status(404).send("File not found.");

    res.download(filePath);
  });
});

module.exports = router;
