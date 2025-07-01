const fileInput = document.getElementById("fileInput");
const folderInput = document.getElementById("folderInput");

fileInput.addEventListener("change", () => {
  uploadFiles(fileInput.files, false);
});

folderInput.addEventListener("change", () => {
  uploadFiles(folderInput.files, true);
});

async function uploadFiles(fileList, includePaths) {
  if (!fileList || fileList.length === 0) return;

  const formData = new FormData();

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    formData.append("files", file);
    if (includePaths) {
      const relativePath = file.webkitRelativePath || file.name;
      formData.append("paths", relativePath);
    }
  }

  const response = await fetch("/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Error uploading files: ${error.msg}`);
    return;
  }

  const result = await response.json();
  if (result.msg === "File uploaded successfully") {
    alert("Files uploaded successfully!");
    location.reload();
  }
}

function deleteFile(fileName) {
  if (confirm(`Are you sure you want to delete ${fileName}?`)) {
    fetch(`/files/d/file/${fileName}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.msg);
        location.reload(); // Reload to update the file list
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        alert("Error deleting file.");
      });
  }
}

function deleteFolder(folderName) {
  if (confirm(`Are you sure you want to delete the folder ${folderName}?`)) {
    fetch(`/files/d/folder/${folderName}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.msg);
        location.reload(); // Reload to update the file list
      })
      .catch((error) => {
        console.error("Error deleting folder:", error);
        alert("Error deleting folder.");
      });
  }
}

const uploadContainers = document.querySelectorAll(".cute-upload-container");

uploadContainers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    container.classList.add("dragging");
  });

  container.addEventListener("dragleave", () => {
    container.classList.remove("dragging");
  });

  container.addEventListener("drop", async (e) => {
    e.preventDefault();
    container.classList.remove("dragging");

    const items = e.dataTransfer.items;
    const files = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry?.();
      if (entry) await traverseFileTree(entry, "", files);
    }

    uploadFiles(files, true); // set true to include paths
  });
});

async function traverseFileTree(item, path = "", files = []) {
  return new Promise((resolve) => {
    if (item.isFile) {
      item.file((file) => {
        file.webkitRelativePath = path + file.name;
        files.push(file);
        resolve();
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries(async (entries) => {
        for (const entry of entries) {
          await traverseFileTree(entry, path + item.name + "/", files);
        }
        resolve();
      });
    }
  });
}
