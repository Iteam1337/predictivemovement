const express = require('express')
const { port } = require('./config')
const routes = require('./routes')
const bodyParser = require('body-parser')

const app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

routes(app)

app.listen(port, console.log(`listening on ${port}`))
