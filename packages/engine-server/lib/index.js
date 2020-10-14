const server = require('http').createServer()
const io = require('socket.io')(server)
require('events').defaultMaxListeners = 20

const port = 4000
const bookingsCache = new Map()
const vehiclesCache = new Map()
const planCache = new Map()

server.listen(port)

require('./routes')({ io, bookingsCache, vehiclesCache, planCache })
