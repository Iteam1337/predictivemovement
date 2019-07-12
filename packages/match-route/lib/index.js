const express = require('express')
const {
  port
} = require('./config')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')
console.log('random changess')
const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
const server = require('http').Server(app)
const io = require('socket.io')(server)
routes(app, io)

server.listen(port, console.log(`listening on ${port}`))