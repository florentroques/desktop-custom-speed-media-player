#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting Desktop Custom Speed Media Player in development mode...\n");

// Start React development server
const reactProcess = spawn("npm", ["run", "start:react"], {
  stdio: "inherit",
  shell: true,
});

// Wait a bit for React to start, then start Electron
setTimeout(() => {
  console.log("\n📱 Starting Electron application...\n");

  const electronProcess = spawn("npm", ["run", "start:electron"], {
    stdio: "inherit",
    shell: true,
  });

  electronProcess.on("close", (code) => {
    console.log(`\n❌ Electron process exited with code ${code}`);
    reactProcess.kill();
    process.exit(code);
  });
}, 5000);

reactProcess.on("close", (code) => {
  console.log(`\n❌ React process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down development servers...");
  reactProcess.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down development servers...");
  reactProcess.kill();
  process.exit(0);
});
