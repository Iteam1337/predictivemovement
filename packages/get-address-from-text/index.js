const express = require('express')
const app = express()
const routes = require('./routes')
const PORT = process.env.PORT || 3000

routes.add(app)

app.listen(PORT, async () => {
  console.log('Runningss')
})
