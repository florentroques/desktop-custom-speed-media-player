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

// Copy assets folder to build directory
const assetsDir = path.join(electronDir, "assets");
const buildAssetsDir = path.join(buildDir, "assets");

if (fs.existsSync(assetsDir)) {
  // Create assets directory in build if it doesn't exist
  if (!fs.existsSync(buildAssetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
  }

  // Copy all files from assets directory
  const assetsFiles = fs.readdirSync(assetsDir);
  assetsFiles.forEach((file) => {
    const sourcePath = path.join(assetsDir, file);
    const destPath = path.join(buildAssetsDir, file);
    fs.copyFileSync(sourcePath, destPath);
  });
  console.log("✅ Copied electron/assets to build/assets");
} else {
  console.warn("⚠️  electron/assets directory not found");
}

// Also copy icon.ico to build root for electron-builder
const iconSourcePath = path.join(electronDir, "assets", "icon.ico");
const iconDestPath = path.join(buildDir, "icon.ico");

if (fs.existsSync(iconSourcePath)) {
  fs.copyFileSync(iconSourcePath, iconDestPath);
  console.log("✅ Copied icon.ico to build root");
} else {
  console.warn("⚠️  icon.ico not found in electron/assets");
}

console.log("✅ Electron files copied successfully!");
