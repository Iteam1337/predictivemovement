const express = require('express')
const app = express()
const routes = require('./routes')

routes.add(app)

app.listen(3000, async () => {
  console.log('Running')
})
