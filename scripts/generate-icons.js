const fs = require("fs");
const path = require("path");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("sharp not installed. Installing...");
    require("child_process").execSync("npm install sharp --no-save", {
      stdio: "inherit",
    });
    sharp = require("sharp");
  }

  const logoPath = path.join(__dirname, "..", "logo.webp");
  const resDir = path.join(__dirname, "..", "android", "app", "src", "main", "res");

  if (!fs.existsSync(logoPath)) {
    console.error("logo.webp not found at", logoPath);
    process.exit(1);
  }

  const sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
  };

  for (const [dir, size] of Object.entries(sizes)) {
    const outDir = path.join(resDir, dir);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Foreground for adaptive icons: 108dp canvas, logo at ~40% (safe zone)
    const fgSize = Math.round(size * 1.5);
    const fgLogoSize = Math.round(fgSize * 0.40);
    const fgPadding = Math.round((fgSize - fgLogoSize) / 2);

    await sharp(logoPath)
      .resize(fgLogoSize, fgLogoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .extend({
        top: fgPadding,
        bottom: fgPadding,
        left: fgPadding,
        right: fgPadding,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(path.join(outDir, "ic_launcher_foreground.png"));
    console.log(`Generated ${dir}/ic_launcher_foreground.png (${fgSize}x${fgSize}, logo ${fgLogoSize}px)`);

    // Square icon: logo at 70% with white background
    const sqLogoSize = Math.round(size * 0.70);
    const sqPadding = Math.round((size - sqLogoSize) / 2);

    await sharp(logoPath)
      .resize(sqLogoSize, sqLogoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .extend({
        top: sqPadding,
        bottom: sqPadding,
        left: sqPadding,
        right: sqPadding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(path.join(outDir, "ic_launcher.png"));
    console.log(`Generated ${dir}/ic_launcher.png (${size}x${size}, logo ${sqLogoSize}px)`);

    // Round icon: same as square but with circle mask
    const rounded = await sharp(logoPath)
      .resize(sqLogoSize, sqLogoSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .extend({
        top: sqPadding,
        bottom: sqPadding,
        left: sqPadding,
        right: sqPadding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .composite([{
        input: Buffer.from(
          `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#fff"/></svg>`
        ),
        blend: "dest-in",
      }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(outDir, "ic_launcher_round.png"), rounded);
    console.log(`Generated ${dir}/ic_launcher_round.png (${size}x${size})`);
  }

  console.log("\nAll icons regenerated with proper padding!");
}

main().catch(console.error);
