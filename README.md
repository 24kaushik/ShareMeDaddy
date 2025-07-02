# Share Me Daddy

#### Video Demo:  https://www.youtube.com/watch?v=LA27G3qaSnQ

**Share Me Daddy** is a whimsical yet functional Node.js-powered web server designed to make local file sharing as effortless as possible. Built for speed, simplicity, and a touch of humor, it allows users to host and access files on their network without installing additional software or dealing with complex configurations.

Whether you're a developer transferring assets, a student sharing notes, or just someone who wants to beam memes across devices without cloud storage or messaging apps, Share Me Daddy provides a no-friction, no-dependency solution that just works — instantly.

---

## Project Overview

Share Me Daddy is fundamentally a file explorer served over HTTP. It hosts a local web interface that anyone on your local area network (LAN) can access. The web interface provides options to:

- Browse and download files.
- Upload new files or entire folders.
- Delete existing files and folders.
- Scan a QR code to instantly open the interface on mobile.

The server is built using [Express.js](https://expressjs.com/) and utilizes [Multer](https://github.com/expressjs/multer) for handling file uploads. It generates a responsive HTML frontend using templating and includes JavaScript for drag-and-drop file and folder uploads.

---

## Files and Structure

Here's what each file does:

### `server.js`
This is the entry point of the application. It initializes the Express server, configures middleware, serves static files from the `shared/` folder, and mounts the upload and delete routes from the `routes/files.js` module.

### `routes/files.js`
Handles all file system operations:
- Uploads (both files and folder trees).
- Secure movement of temporary uploads.
- Deletion of files or directories.
It uses `multer` for file parsing, `fs` for manipulation, and safety checks to avoid directory traversal attacks.

### `views/layout.js`
This file exports a templated HTML layout function that injects server data dynamically into the web interface. It uses a mix of vanilla JavaScript and inline HTML to display QR codes, upload options, and the file list.

### `public/style.css`
Contains the stylings for the UI, including custom file/folder upload cards, drag-over effects, and responsive layout handling.

### `public/script.js`
The frontend logic:
- Handles input-based and drag-and-drop file uploads.
- Traverses folders recursively using `webkitRelativePath`.
- Sends appropriate metadata for path reconstruction.
- Also manages file/folder deletion from the UI.

### `utils/network.js`
A utility function that gets the local IP address of the device, so it can be shown in the terminal and embedded into the QR code. This allows easy mobile access.

### `constants.js`
Stores the server's default port and other configurable constants. Designed to be expandable in the future.

---

## Design Decisions

1. **Temporary Upload Directory**:  
   Files are initially uploaded to a `tmp/` folder. After confirming valid paths (sent alongside file data), files are securely moved into the `shared/` directory. This ensures malicious files can't overwrite critical parts of the server’s file structure.

2. **Path Handling with `webkitRelativePath`**:  
   The browser provides relative folder paths (e.g., `"Documents/MyProject/file.txt"`) when folders are uploaded. These paths are sent as a parallel `paths[]` field in the `FormData`, which the backend uses to reconstruct folders server-side.

3. **Drag-and-Drop Uploads**:  
   Implemented using `webkitGetAsEntry()` to allow recursive traversal of folders. This enhances user experience for bulk uploads without relying on ZIP files.

4. **No Database Required**:  
   The app intentionally avoids external databases or cloud storage. Files are served directly from the filesystem, keeping it lean and portable.

5. **Security**:  
   Basic checks are implemented to prevent directory traversal attacks (e.g., ensuring uploads and deletions stay within the shared folder). Planned future additions include password protection.

6. **No Build Step**:  
   Everything runs as-is with `node server.js`. It’s intended to be accessible even to those with minimal Node.js experience.

---

## Usage

1. **Install dependencies:**
   ```bash
   git clone https://github.com/24kaushik/ShareMeDaddy.git
   cd ShareMeDaddy
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Access the UI:**
   Open the URL shown in your terminal (`http://<your-local-ip>:3000`) from any device connected to the same network.

4. **Upload Files/Folders:**
   - Use file/folder buttons or drag them into the drop areas.
   - Shared content appears in the UI immediately.
   - Uploaded folders retain their original structure.

5. **Delete Files/Folders:**
   - Click the delete buttons in the UI.
   - Confirm action via popup.

---

## Future Improvements

- **🔐 Password Protection**  
  Add optional authentication for more secure file sharing.

- **🎨 Enhanced UI**  
  A richer, modern front-end design using a framework like React or Vue.

- **📦 ZIP Support**  
  Option to download entire folders as `.zip` archives.

- **🌍 LAN Discovery**  
  Show available hosts running Share Me Daddy on the same network.

- **🖥️ System Tray App**  
  Electron or Tauri wrapper for a native desktop app feel.

---

## License

MIT License — do what you want, just don't blame daddy when things break.

---

## Final Thoughts

This project aims to make quick, private file sharing painless for non-technical users while staying flexible and hackable for developers. It’s a showcase of practical Node.js usage combined with a sense of humor. The codebase is small, readable, and easy to contribute to.

Pull requests and stars are welcome!

<center><b>❤️ Made with questionable judgement and Node.js by Kaushik Sarkar. ❤️</b></center>