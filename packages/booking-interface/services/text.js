const axios = require('axios')

const getTextFromPhoto = (imageUrl) =>
  axios
    .get(
      `${
        process.env.EXTRACT_TEXT_FROM_PIC_URL || 'http://localhost:4001'
      }/gettext?url=${imageUrl}`
    )
    .then((res) => res.data.text)

module.exports = { getTextFromPhoto }
