const { extractTextFromImageUrl } = require('../services/tesseract')

async function getText({ query: { url } }, res, next) {
  const data = await extractTextFromImageUrl(url)
  res.send(data)
}

module.exports = {
  getText,
}
