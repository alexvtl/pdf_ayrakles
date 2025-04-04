const fs = require('fs');
const path = require('path');

const getImageBase64 = (imagePath, classImage) => {
  const absolutePath = path.resolve(__dirname, imagePath);
  const imageData = fs.readFileSync(absolutePath);
  const ext = path.extname(imagePath).slice(1); // ex: 'png', 'jpg'
  const base64 = `data:image/${ext};base64,${imageData.toString('base64')}`;
  return `<img style="${classImage}" src="${base64}" />`
}

module.exports = { getImageBase64 };