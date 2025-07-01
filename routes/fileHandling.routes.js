// Imports
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Create a router instance
const router = express.Router();

// Define the shared folder path
const sharedFolder = path.join(__dirname, "..", "shared");
const tmpFolder = path.join(__dirname, "..", "tmp");

// Setup multer storage configuration
// This will save files in the shared folder, maintaining the original directory structure
const storage = multer.diskStorage({
  destination: tmpFolder,
  filename: (req, file, cb) => {
    const name = path.basename(file.originalname);
    cb(null, name);
  },
});
// Initialize multer with the storage configuration
const upload = multer({ storage });

// Route to delete a file
router.delete("/d/file/:fileName", (req, res) => {
  const filePath = path.join(sharedFolder, req.params.fileName);

  // Resolve the target path to prevent directory traversal attacks
  const targetPath = path.resolve(filePath);
  const relative = path.relative(sharedFolder, targetPath);
  if (relative.startsWith("..")) {
    return res.status(400).json({ msg: "Bad file path" });
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ msg: "Error deleting file." });
    }
    res.status(200).json({ msg: "File deleted successfully." });
  });
});

// Route to delete a folder
router.delete("/d/folder/:folderName", (req, res) => {
  const folderPath = path.join(sharedFolder, req.params.folderName);

  // Resolve the target path to prevent directory traversal attacks
  const targetPath = path.resolve(folderPath);
  const relative = path.relative(sharedFolder, targetPath);
  if (relative.startsWith("..")) {
    return res.status(400).json({ msg: "Bad folder path" });
  }

  // Delete the folder recursively
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      return res.status(500).json({ msg: "Error deleting folder." });
    }
    res.status(200).json({ msg: "Folder deleted successfully." });
  });
});

// Route to upload a file or folder
router.post("/upload", upload.any(), (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files?.length) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    // Move files from tmp folder to shared folder
    if (req.body.paths) {
      const paths = Array.isArray(req.body.paths)
        ? req.body.paths
        : [req.body.paths];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        // Check if the path exists for the given file
        const p = paths[i];
        if (!p) return res.status(400).json({ msg: "Missing path for file" });

        // Resolve the target path to prevent directory traversal attacks
        const targetDir = path.join(sharedFolder, path.dirname(p));
        const rel = path.relative(sharedFolder, targetDir);
        if (rel.startsWith("..")) {
          return res.status(400).json({ msg: "Invalid upload path" });
        }

        // Create the target directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Move the file from tmp folder to the target directory
        const tmpPath = path.join(tmpFolder, file.filename);
        const sharedPath = path.join(targetDir, file.originalname);
        fs.renameSync(tmpPath, sharedPath);
      }
    } else {
      // If no paths are provided, move files to the shared folder directly
      req.files.forEach((file) => {
        const tmpPath = path.join(tmpFolder, file.filename);
        const sharedPath = path.join(sharedFolder, file.originalname);
        fs.renameSync(tmpPath, sharedPath);
      });
    }
    
    return res.status(200).json({
      msg: "File uploaded successfully",
      files: req.files.map((_, i) => {
        const relPath =
          req.body.paths?.[i] || req.body.paths || req.files[i].originalname;
        return relPath;
      }),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    fs.rm(tmpFolder, { recursive: true, force: true });
    return res.status(500).json({ msg: "Error uploading files" });
  }
});

module.exports = router;
