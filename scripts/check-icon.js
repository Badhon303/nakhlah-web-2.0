const sharp = require("sharp");
sharp("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
  .metadata()
  .then(m => console.log(JSON.stringify(m, null, 2)));
