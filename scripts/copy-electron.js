const fs = require("fs");
const path = require("path");

// Copy electron files to build directory
const electronDir = path.join(__dirname, "../electron");
const buildDir = path.join(__dirname, "../build");

// Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy main.js to build/electron.js
const mainJsPath = path.join(electronDir, "main.js");
const electronJsPath = path.join(buildDir, "electron.js");

if (fs.existsSync(mainJsPath)) {
  fs.copyFileSync(mainJsPath, electronJsPath);
  console.log("✅ Copied electron/main.js to build/electron.js");
} else {
  console.error("❌ electron/main.js not found");
  process.exit(1);
}

// Copy preload.js to build directory
const preloadJsPath = path.join(electronDir, "preload.js");
const buildPreloadPath = path.join(buildDir, "preload.js");

if (fs.existsSync(preloadJsPath)) {
  fs.copyFileSync(preloadJsPath, buildPreloadPath);
  console.log("✅ Copied electron/preload.js to build/preload.js");
} else {
  console.error("❌ electron/preload.js not found");
  process.exit(1);
}

console.log("✅ Electron files copied successfully!");
