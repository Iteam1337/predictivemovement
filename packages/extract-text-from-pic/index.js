const express = require('express')
const app = express()
const routes = require('./src/routes')
const PORT = process.env.PORT || 4000

routes.add(app)

app.listen(PORT, async () => {
  console.log('Running')
})
