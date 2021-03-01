const { getAddressFromText } = require('../services/getAddressFromText')

exports.add = (app) => {
  app.get('/getAddressFromText', async (req, res, next) => {
    const data = await getAddressFromText(req.query.text)
    res.json(data)
    next()
  })
}
