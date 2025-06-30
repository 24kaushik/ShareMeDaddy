# Share Me Daddy

> Effortless local file sharing — because sometimes you just need it _now_.

**Share Me Daddy** is a simple, fun, and fast Node.js-based local file sharing server.  
Spin it up on your PC, browse or download files from any other device on your network — no complicated setups, no third-party apps, no nonsense.

---

## Features

- Browse and download files and folders from your PC using any device on the same Wi-Fi or LAN.
- Instant setup — run it and get a link you can open immediately.
- Auto-generates a web interface to view and download files.
- QR code support for quick access from phones.

---

## Installation

Make sure you have **Node.js** installed.  
Then in your terminal:

```bash
git clone https://github.com/24kaushik/ShareMeDaddy.git
cd ShareMeDaddy
npm install
```

---

## Usage

1. Put the files or folders you want to share inside the `shared/` directory (or configure a different one).
2. Start the server:

```bash
node server.js
```

3. Open the link shown in the terminal on any device in your network.  
   Example: `http://192.168.1.42:3000/`

4. Browse and download as much as your heart desires.

---

## Configuration

You can edit `server.js` to:

- Change the shared folder path.
- Add simple password protection.
- Customize port number.

(Full configuration options coming soon.)

---

## Planned Features

- 🔐 Add optional password protection for sensitive files.
- 📂 Select folders dynamically without needing to move files.
- 🎨 Prettier front-end interface.
- 🚀 One-click portable version.

---

## License

This project is licensed under the MIT License.  
Do whatever you want — just don't blame daddy when things go wrong.

---

<center><b>❤️ Made with questionable judgement and Node.js by Kaushik Sarkar. ❤️</b></center>
