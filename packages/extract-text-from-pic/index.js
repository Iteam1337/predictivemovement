const express = require('express')
const app = express()
const routes = require('./src/routes')

routes.add(app)

app.listen(4000, async () => {
  console.log('Running')
})
