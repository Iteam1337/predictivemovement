const textract = require('textract')

const config = {
  tesseract: {
    lang: 'swe',
    oem: 1,
    psm: 3,
  },
}

function extractTextFromImageUrl(url) {
  return new Promise((resolve) => {
    textract.fromUrl(
      url,
      config,
      (error, text) => console.log(error) || resolve(text)
    )
  })
}

function extractTextFromImage(mimeType, img) {
  return new Promise((resolve) => {
    textract.fromBufferWithMime(
      mimeType,
      Buffer.from(img, 'base64'),
      config,
      (error, text) => {
        console.log('text from picture', text)
        resolve(text)
      }
    )
  })
}

module.exports = {
  extractTextFromImageUrl,
  extractTextFromImage,
}
