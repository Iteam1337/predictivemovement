const axios = require('axios')

const getTextFromPhoto = (imageUrl) =>
  axios
    .get(`http://localhost:4000/gettext?url=${imageUrl}`)
    .then((res) => res.data.text)

module.exports = { getTextFromPhoto }
