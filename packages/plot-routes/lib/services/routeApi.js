const { destination, routeApi: socketURI } = require('../config')
const io = require('socket.io-client')

const routeApi = require('../adapters/routeApi')

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

    socket.on('changeRequested', async id => {
      try {
        await routeApi.get(`/pending-route/${id}`) // check if route exists ...

        socket.emit(
          'event',
          JSON.stringify({
            payload: { id },
            type: 'acceptChange',
          })
        )

        await sleep(1000) // race condition!

        resolve(socket)
      } catch (_) {
        reject(socket)
      }
    })

    socket.on('congrats', () => resolve(socket))
    socket.on('disconnect', () => reject(socket))
  })
}

module.exports = {
  newRoute,
  newPickup,
}
