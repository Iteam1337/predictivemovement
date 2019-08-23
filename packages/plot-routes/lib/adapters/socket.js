const io = require('socket.io-client')
const { routeApi } = require('../config')

let congrats = 0

module.exports = {
  get confirmed () {
    return congrats
  },

  newSocket () {
    const socket = io(routeApi)

    socket.on('congrats', () => ++congrats)

    return socket
  },
}
