const getLocalIP = require("../utils/network");
const localIP = getLocalIP();

module.exports = function layout(title, files) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <button class="toggleQr" onclick="document.querySelector('.qrCode').classList.toggle('hidden')">
        <svg stroke="currentColor" fill="#e91e63" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" x="336" y="336" rx="8" ry="8"></rect><rect width="64" height="64" x="272" y="272" rx="8" ry="8"></rect><rect width="64" height="64" x="416" y="416" rx="8" ry="8"></rect><rect width="48" height="48" x="432" y="272" rx="8" ry="8"></rect><rect width="48" height="48" x="272" y="432" rx="8" ry="8"></rect><path d="M448 32H304a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32zm-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8zM208 32H64a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32zm-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8zm32 104H64a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V304a32 32 0 0 0-32-32zm-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8z"></path></svg>
      </button>
      <div class="qrCode hidden">
        <h2>Scan me!</h2>
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=http://${localIP}:3000&size=200x200" alt="QR Code">
      </div>
      <h1>Share Me Daddy</h1>
      <p>Pick your file, baby.</p>

      <div class="file-list" id="fileList">
        ${files}
      </div>

      <footer>
        <div>
          ❤️ Made with questionable judgement and Node.js by Kaushik Sarkar. ❤️
        </div>
        <div class="links">
          <a href="https://github.com/24kaushik/ShareMeDaddy" target="_blank">GitHub</a> |
          <a href="https://github.com/24kaushik/ShareMeDaddy?tab=MIT-1-ov-file" target="_blank">License</a>
        </div>
      </footer>

    </body>
    </html>
  `;
};
