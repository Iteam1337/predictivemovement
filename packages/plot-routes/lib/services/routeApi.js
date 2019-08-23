const genPayload = require('../util/genPayload')
const sleep = require('../util/sleep')
const routeApi = require('../adapters/routeApi')
const { newSocket } = require('../adapters/socket')

const newPickup = async startPosition => {
  const payload = genPayload(startPosition)
  const socket = newSocket()

  return new Promise((resolve, reject) => {
    socket.on('connect', async () => {
      try {
        socket.emit(
          'event',
          JSON.stringify({
            payload,
            type: 'passenger',
          })
        )

        await sleep()

        resolve(socket)
      } catch (_) {
        reject(socket.close())
      }
    })

    socket.on('disconnect', () => reject(socket.close()))
  })
}

const newRoute = async startPosition => {
  const payload = genPayload(startPosition)
  const socket = newSocket()

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
        reject(socket.close())
      }
    })

    socket.on('congrats', () => resolve(socket))
    socket.on('disconnect', () => reject(socket.close()))
  })
}

module.exports = {
  newRoute,
  newPickup,
}
