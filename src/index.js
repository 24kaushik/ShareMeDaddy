const express = require("express");
const serveIndex = require("serve-index");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();
const PORT = 3000;

// Folder you want to share
const sharedFolder = path.join(__dirname, "shared");


app.get("/files", (req, res) => {
  fs.readdir(sharedFolder, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to read directory");
    }

    let fileLinks = files
      .filter(file => file !== ".gitkeep" && file !== "serveIndex")  // Ignore .gitkeep and other unwanted files
      .map(file => {
        const filePath = path.join(sharedFolder, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        const fileIcon = '<svg style="width:18px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';

        const folderIcon = '<svg style="width:18px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 10L13 10" stroke="#ecf000" stroke-width="3" stroke-linecap="round"></path> <path d="M10 3H16.5C16.9644 3 17.1966 3 17.3916 3.02567C18.7378 3.2029 19.7971 4.26222 19.9743 5.60842C20 5.80337 20 6.03558 20 6.5" stroke="#ecf000" stroke-width="3"></path> <path d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" stroke="#ecf000" stroke-width="3"></path> </g></svg>'

        // Add links based on whether the item is a file or folder
        if (isDirectory) {
          return `<div class="file-item folder">${folderIcon}<a href="/files/${file}/download">${file} (Download Zipped)</a></div>`;
        } else {
          return `<div class="file-item">${fileIcon}<a href="/files/${file}">${file}</a></div>`;
        }
      })
      .join("");

    res.send(`
      <html>
      <head><title>Share Me Daddy</title></head>
      <body>
        <h1>Welcome to Share Me Daddy</h1>
        <p>Select a file or folder:</p>
        <div class="file-list">${fileLinks}</div>
      </body>
      </html>
    `);
  });
});

app.use("/files", express.static(sharedFolder));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Download a folder as a zip file
app.get("/files/:folder/download", (req, res) => {
  const folderPath = path.join(sharedFolder, req.params.folder);
  
  // Check if it's a valid directory
  fs.stat(folderPath, (err, stats) => {
    if (err || !stats.isDirectory()) {
      return res.status(404).send("Folder not found.");
    }

    // Set up the response as a zip download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${req.params.folder}.zip"`);

    const archive = archiver("zip", {
      zlib: { level: 9 } // Best compression
    });

    // Pipe the archive to the response
    archive.pipe(res);

    // Append the folder to the archive
    archive.directory(folderPath, false);

    // Finalize the archive (send the zip file)
    archive.finalize();
  });
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server running at http://${getLocalIP()}:${PORT}/files`);
});
