const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  Menu,
} = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

let mainWindow;
let initialVideoPath = null;

// Handle command line arguments for file opening
function handleCommandLineArguments() {
  const args = process.argv.slice(1);
  for (const arg of args) {
    if (
      arg.endsWith(".mp4") ||
      arg.endsWith(".avi") ||
      arg.endsWith(".mkv") ||
      arg.endsWith(".mov") ||
      arg.endsWith(".wmv") ||
      arg.endsWith(".flv") ||
      arg.endsWith(".webm") ||
      arg.endsWith(".m4v")
    ) {
      initialVideoPath = arg;
      break;
    }
  }
}

// Helper function to check if a path is a video file
function isVideoFile(filePath) {
  const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
  return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
    // macOS specific settings
    ...(process.platform === 'darwin' && {
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 10, y: 10 }
    })
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Make the app a single instance app


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    // Handle command line arguments
    handleCommandLineArguments();

    // Remove the default menu
    Menu.setApplicationMenu(null);
    createWindow();
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle file opening on macOS (when app is already running)
app.on("open-file", (event, filePath) => {
  event.preventDefault();
  
  console.log('File opened:', filePath);
  
  if (isVideoFile(filePath)) {
    if (mainWindow) {
      // App is already running, send the file to the renderer
      mainWindow.webContents.send("open-video-file", filePath);
    } else {
      // App is starting up, store the path
      initialVideoPath = filePath;
    }
  } else {
    console.log('Not a video file:', filePath);
  }
});

// Handle URL opening (for custom URL schemes if needed)
app.on("open-url", (event, url) => {
  event.preventDefault();
  // Handle custom URL schemes if needed in the future
});

// Handle second instance (when app is already running and user opens a file)
app.on("second-instance", (event, commandLine, workingDirectory) => {
  console.log('Second instance detected with command line:', commandLine);
  
  // Someone tried to run a second instance, we should focus our window instead
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();

    // Check if a video file was passed as argument
    const videoPath = commandLine.find(arg => isVideoFile(arg));

    if (videoPath) {
      console.log('Opening video file from second instance:', videoPath);
      // Send the video path to the renderer process
      mainWindow.webContents.send("open-video-file", videoPath);
    }
  }
});

// IPC handlers for file operations
ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      {
        name: "Video Files",
        extensions: ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v"],
      },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle("open-folder-dialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle window controls
ipcMain.handle("minimize-window", () => {
  mainWindow.minimize();
});

ipcMain.handle("maximize-window", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle("close-window", () => {
  mainWindow.close();
});

// Get initial video path from command line arguments
ipcMain.handle("get-initial-video-path", () => {
  return initialVideoPath;
});
