const fs = require("fs");
const path = require("path");

async function main() {
  const sharp = require("sharp");
  const logoPath = path.join(__dirname, "..", "logo.webp");
  const resDir = path.join(__dirname, "..", "android", "app", "src", "main", "res");

  // Splash screen sizes for portrait
  const splashSizes = {
    "drawable-port-mdpi": { w: 480, h: 800 },
    "drawable-port-hdpi": { w: 720, h: 1280 },
    "drawable-port-xhdpi": { w: 960, h: 1600 },
    "drawable-port-xxhdpi": { w: 1440, h: 2560 },
    "drawable-port-xxxhdpi": { w: 1920, h: 3200 },
  };

  for (const [dir, { w, h }] of Object.entries(splashSizes)) {
    const outDir = path.join(resDir, dir);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const logoSize = Math.round(Math.min(w, h) * 0.3);

    const logoBuffer = await sharp(logoPath)
      .resize(logoSize, logoSize, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{
        input: logoBuffer,
        gravity: "center",
      }])
      .png()
      .toFile(path.join(outDir, "splash.png"));
    console.log(`Generated ${dir}/splash.png (${w}x${h})`);
  }

  console.log("\nAll splash screens generated!");
}

main().catch(console.error);
