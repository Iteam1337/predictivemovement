const { getAddressFromText } = require('../services/getAddressFromText')

exports.add = (app) => {
  app.get('/getAddressFromText', async (req, res, next) => {
    console.log('tja')
    res.send(await getAddressFromText(req.query.text))
    next()
  })
}
