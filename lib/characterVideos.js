// Central map for character animation videos.
// Replace local paths with Cloudinary video URLs to get CDN delivery + auto format/quality.
// When a Cloudinary URL is detected, we automatically inject f_auto,q_auto for optimization.

const CHARACTER_VIDEO_URLS = {
  happy: "/animations/new_happy_girl_2_pics.webm",
  sad: "/animations/new_sad_boy_2_pics.webm",
};

function optimizeCloudinaryVideo(url) {
  if (!url) return url;
  if (
    url.includes("res.cloudinary.com") &&
    url.includes("/video/upload/") &&
    !url.includes("/video/upload/f_auto")
  ) {
    return url.replace("/video/upload/", "/video/upload/f_auto,q_auto/");
  }
  return url;
}

export function getCharacterVideo(key) {
  const url = CHARACTER_VIDEO_URLS[key] || CHARACTER_VIDEO_URLS.happy;
  return optimizeCloudinaryVideo(url);
}
