const {
  extractTextFromImageUrl,
  extractTextFromImage,
} = require('../services/tesseract')

async function getText({ query: { url } }, res, next) {
  const data = await extractTextFromImageUrl(url)
  res.json({ text: data })
}

async function getTextPost(req, res, next) {
  const img = req.body.image
  const mimeType = req.body.mimeType
  const data = await extractTextFromImage(mimeType, img)
  res.json({ text: data })
}

module.exports = {
  getText,
  getTextPost,
}
