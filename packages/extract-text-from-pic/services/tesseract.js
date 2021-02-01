const textract = require('textract')
const { parseFreightInfo } = require('../helpers/parseFreightInfo')

const config = {
  lang: 'swe',
  oem: 1,
  psm: 3,
}

function extractTextFromImageUrl(url) {
  return new Promise((resolve) => {
    textract.fromUrl(url, config, (error, text) =>
      resolve(parseFreightInfo(text))
    )
  })
}

module.exports = {
  extractTextFromImageUrl,
}
