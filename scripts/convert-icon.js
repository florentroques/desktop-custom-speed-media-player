const fs = require("fs");
const path = require("path");

async function convertIcon() {
  const pngPath = path.join(__dirname, "../electron/assets/icon.png");
  const icoPath = path.join(__dirname, "../electron/assets/icon.ico");

  try {
    console.log("Converting PNG to ICO...");
    const pngToIco = await import("png-to-ico");
    const ico = await pngToIco.default(pngPath);

    fs.writeFileSync(icoPath, ico);
    console.log("✅ Successfully converted PNG to ICO");
    console.log(`✅ ICO file saved to: ${icoPath}`);
  } catch (error) {
    console.error("❌ Error converting PNG to ICO:", error.message);
    process.exit(1);
  }
}

convertIcon();
