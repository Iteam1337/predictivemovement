const { destination, routeApi: socketURI } = require('../config')
const io = require('socket.io-client')

const sleep = (timeout = 1000) =>
  new Promise(resolve => setTimeout(() => resolve(), timeout))

const genPayload = startPosition => {
  const date = new Date().toISOString().split('T')[0]
  return {
    start: {
      date,
      position: startPosition,
    },
    end: {
      date,
      position: destination,
    },
  }
}

const newPickup = async startPosition => {
  const payload = genPayload(startPosition)
  const socket = io(socketURI)

  return new Promise(resolve => {
    socket.on('connect', async () => {
      socket.emit(
        'event',
        JSON.stringify({
          payload,
          type: 'passenger',
        })
      )

      await sleep()

      resolve(socket)
    })
  })
}

const newRoute = async startPosition => {
  const payload = genPayload(startPosition)
  const socket = io(socketURI)
  let id

  return new Promise((resolve, reject) => {
    socket.on('connect', () =>
      socket.emit(
        'event',
        JSON.stringify({
          payload,
          type: 'driver',
        })
      )
    )

    socket.on('changeRequested', changeRequestID => {
      id = changeRequestID

      socket.emit(
        'event',
        JSON.stringify({
          payload: { id },
          type: 'acceptChange',
        })
      )
    })

    socket.on('congrats', () => resolve(socket))
    socket.on('disconnect', () => reject(socket))
  })
}

module.exports = {
  newRoute,
  newPickup,
}
