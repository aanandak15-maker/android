const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Generate a simple icon with emoji
async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#10B981"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="${size * 0.5}" fill="white">🌾</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(publicDir, `icon-${size}x${size}.png`));
}

// Generate different sizes
Promise.all([
  generateIcon(192),
  generateIcon(512),
  generateIcon(180), // For iOS
  generateIcon(32), // Favicon
])
  .then(() => {
    console.log("Icons generated successfully!");
  })
  .catch(console.error);
