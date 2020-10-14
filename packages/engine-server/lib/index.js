const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')

const port = 4000
const bookingsCache = new Map()
const vehiclesCache = new Map()
const planCache = new Map()

const server = require('http').createServer()
const io = require('socket.io')(server)
server.listen(port)

require('./routes')({ io, bookingsCache, vehiclesCache, planCache })
