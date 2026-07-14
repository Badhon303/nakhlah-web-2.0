const fs = require("fs");
const path = require("path");

async function main() {
  const sharp = require("sharp");
  const logoPath = path.join(__dirname, "..", "logo.webp");
  const iconDir = path.join(__dirname, "..", "ios", "App", "App", "Assets.xcassets", "AppIcon.appiconset");

  if (!fs.existsSync(logoPath)) {
    console.error("logo.webp not found at", logoPath);
    process.exit(1);
  }

  if (!fs.existsSync(iconDir)) {
    console.error("AppIcon.appiconset not found at", iconDir);
    process.exit(1);
  }

  // iOS requires a single 1024x1024 PNG with NO alpha channel, sRGB
  // Logo at 70% with white padding (matching Android square icon proportion)
  const iosLogoSize = Math.round(1024 * 0.70);
  const iosPadding = Math.round((1024 - iosLogoSize) / 2);

  // Step 1: Resize logo with white background
  const logoBuffer = await sharp(logoPath)
    .resize(iosLogoSize, iosLogoSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  // Step 2: Create 1024x1024 white canvas and composite logo centered, then flatten to remove alpha
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: logoBuffer, gravity: "center" }])
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(path.join(iconDir, "AppIcon-512@2x.png"));

  console.log(`Generated iOS AppIcon-512@2x.png (1024x1024, logo ${iosLogoSize}px, no alpha)`);

  // Also generate splash screen
  const splashDir = path.join(__dirname, "..", "ios", "App", "App", "Assets.xcassets", "Splash.imageset");
  if (fs.existsSync(splashDir)) {
    const splashLogo = await sharp(logoPath)
      .resize(800, 800, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    for (const filename of ["splash-2732x2732-2.png", "splash-2732x2732-1.png", "splash-2732x2732.png"]) {
      await sharp({
        create: {
          width: 2732,
          height: 2732,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite([{ input: splashLogo, gravity: "center" }])
        .png()
        .toFile(path.join(splashDir, filename));
      console.log(`Generated iOS ${filename} (2732x2732)`);
    }
  }

  console.log("\niOS icons generated!");
}

main().catch(console.error);
