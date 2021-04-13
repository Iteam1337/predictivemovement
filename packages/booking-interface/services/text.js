const axios = require('axios')

const getTextFromImage = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  })

  let image = Buffer.from(response.data, 'binary').toString('base64')

  return axios
    .post(
      `${
        process.env.EXTRACT_TEXT_FROM_PIC_URL || 'http://localhost:4001'
      }/gettext`,
      {
        mimeType: 'image/jpeg',
        image,
      }
    )
    .then((res) => res.data.text)
}

module.exports = { getTextFromImage }
