const {
  extractTextFromImageUrl,
  extractTextFromImage,
} = require('../services/tesseract')

async function getText({ query: { url } }, res, next) {
  const data = await extractTextFromImageUrl(url)
  res.send(data)
}

async function getTextPost(req, res, next) {
  const img = req.body.image
  const data = await extractTextFromImage(img)
  res.send(data)
}

module.exports = {
  getText,
  getTextPost,
}
