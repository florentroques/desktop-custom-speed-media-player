const fs = require("fs");
const path = require("path");

async function convertIcon() {
  const pngPath = path.join(__dirname, "../electron/assets/icon.png");
  const icoPath = path.join(__dirname, "../electron/assets/icon.ico");

  try {
    console.log("Converting PNG to ICO with png2icons (512x512 support)...");
    
    // Use png2icons for ICO generation
    const png2icons = require("png2icons");
    
    // Read the PNG file
    const pngBuffer = fs.readFileSync(pngPath);
    
    // Create ICO with multiple sizes including 512x512
    const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BILINEAR, 0, false, false);
    
    // Save the ICO file
    fs.writeFileSync(icoPath, icoBuffer);
    
    // Verify the ICO file size
    const stats = fs.statSync(icoPath);
    console.log(`✅ ICO file size: ${(stats.size / 1024).toFixed(1)} KB`);
    
    console.log("✅ Successfully converted PNG to ICO with 512x512 support");
    console.log(`✅ ICO file saved to: ${icoPath}`);
  } catch (error) {
    console.error("❌ Error converting PNG to ICO:", error.message);
    process.exit(1);
  }
}

convertIcon();
