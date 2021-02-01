const { getText } = require('./getTextFromImage')

exports.add = (app) => {
  app.get('/gettext', getText)
}
