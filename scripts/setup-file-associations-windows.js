const { exec } = require("child_process");
const path = require("path");

// Get the path to the executable
// Try to find the installed executable first, fallback to unpacked version
const fs = require("fs");
let appPath = null;

// Common installation paths to check
const possiblePaths = [
  path.join(
    process.env.LOCALAPPDATA || "",
    "Programs",
    "Custom Speed Video Player",
    "Custom Speed Video Player.exe"
  ),
  path.join(
    process.env.APPDATA || "",
    "Programs",
    "Custom Speed Video Player",
    "Custom Speed Video Player.exe"
  ),
  path.join(
    process.env.PROGRAMFILES || "",
    "Custom Speed Video Player",
    "Custom Speed Video Player.exe"
  ),
  path.join(
    process.env["PROGRAMFILES(X86)"] || "",
    "Custom Speed Video Player",
    "Custom Speed Video Player.exe"
  ),
  path.join(
    __dirname,
    "..",
    "dist",
    "win-unpacked",
    "Custom Speed Video Player.exe"
  ),
];

// Find the first existing path
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    appPath = possiblePath;
    break;
  }
}

// If no path found, use the unpacked version as fallback
if (!appPath) {
  appPath = path.join(
    __dirname,
    "..",
    "dist",
    "win-unpacked",
    "Custom Speed Video Player.exe"
  );
}

if (!fs.existsSync(appPath)) {
  console.error("Error: Custom Speed Video Player executable not found!");
  console.error("Please install the application first or ensure it's built.");
  console.error("Searched in the following locations:");
  possiblePaths.forEach((p, i) => {
    console.error(`  ${i + 1}. ${p}`);
  });
  process.exit(1);
}

console.log(
  "Setting up Windows file associations for Custom Speed Video Player..."
);
console.log("Found executable at:", appPath);

// Check if the executable exists
if (!fs.existsSync(appPath)) {
  console.error("Error: Custom Speed Video Player executable not found!");
  console.error("Please install the application first or ensure it's built.");
  console.error("Searched in the following locations:");
  possiblePaths.forEach((p, i) => {
    console.error(`  ${i + 1}. ${p}`);
  });
  process.exit(1);
}

const videoExtensions = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
];

videoExtensions.forEach((ext) => {
  const command = `assoc .${ext}=CustomSpeedVideoPlayer.${ext}`;
  const command2 = `ftype CustomSpeedVideoPlayer.${ext}="${appPath}" "%1"`;

  console.log(`Setting up .${ext} association...`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(
        `Error setting file association for .${ext}:`,
        error.message
      );
      return;
    }

    exec(command2, (error2, stdout2, stderr2) => {
      if (error2) {
        console.error(`Error setting file type for .${ext}:`, error2.message);
      } else {
        console.log(`Successfully set up .${ext} association`);
      }
    });
  });
});

console.log("\nWindows file association setup complete!");
console.log(
  "You may need to restart your computer for changes to take effect."
);
console.log(
  'Alternatively, you can right-click on a video file, select "Open with" > "Choose another app" and select Custom Speed Video Player.'
);
