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
