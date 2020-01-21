const routes = require('./routes')

const port = 4000

var server = require('http').createServer()
var io = require('socket.io')(server)
server.listen(port)
routes.register(io)
