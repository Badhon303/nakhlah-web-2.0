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

  // iOS requires a single 1024x1024 icon with no alpha channel
  // Logo at 70% with white padding (matching Android square icon proportion)
  const iosLogoSize = Math.round(1024 * 0.70);
  const iosPadding = Math.round((1024 - iosLogoSize) / 2);

  await sharp(logoPath)
    .resize(iosLogoSize, iosLogoSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .extend({
      top: iosPadding,
      bottom: iosPadding,
      left: iosPadding,
      right: iosPadding,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(path.join(iconDir, "AppIcon-512@2x.png"));

  console.log(`Generated iOS AppIcon-512@2x.png (1024x1024, logo ${iosLogoSize}px with padding)`);

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
