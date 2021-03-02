const { getText, getTextPost } = require('./getTextFromImage')

exports.add = (app) => {
  app.get('/gettext', getText)
  app.post('/gettext', getTextPost)
}
