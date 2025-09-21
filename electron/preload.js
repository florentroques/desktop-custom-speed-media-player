const { contextBridge, ipcRenderer } = require("electron");

// Listen for media file open events (video and audio)
ipcRenderer.on("open-media-file", (event, mediaPath) => {
  // Dispatch a custom event that the React app can listen to
  window.dispatchEvent(
    new CustomEvent("media-file-opened", { detail: mediaPath })
  );
});

contextBridge.exposeInMainWorld("electronAPI", {
  // File operations
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  openFolderDialog: () => ipcRenderer.invoke("open-folder-dialog"),
  getInitialVideoPath: () => ipcRenderer.invoke("get-initial-video-path"),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  maximizeWindow: () => ipcRenderer.invoke("maximize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),

  // Platform info
  platform: process.platform,
});
