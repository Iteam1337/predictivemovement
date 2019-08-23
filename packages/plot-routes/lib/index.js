const { count, destination, radiusInKm } = require('./config')
const { randomize } = require('./util/randomAdress')
const { newRoute, newPickup } = require('./services/routeApi')
const socket = require('./adapters/socket')

const main = async () => {
  const points = []
  const sockets = []

  for (let i = 0; i < count; i++) {
    let random
    try {
      random = await randomize()
      points.push(random)
    } catch (_) {
      //
    }
  }

  for (const point of points) {
    const isDriver = Math.random() > 0.7
    const label = isDriver ? 'driver' : 'passenger'
    try {
      sockets.push(isDriver ? await newPickup(point) : await newRoute(point))
      console.log(`added ${label}`)
    } catch (_) {
      console.log(`failed to add ${label}`)
    }
  }

  const missing =
    sockets.length === points.length ? '' : ` (${points.length} possible)`

  console.info(
    `handled ${sockets.length} requests${missing}\n${socket.confirmed} congrats sent`
  )

  await Promise.allSettled(
    sockets.map(socket => (socket && socket.close ? socket.close() : null))
  )
}

console.info(`
starting with destination: ${JSON.stringify(destination)}
with a radius of: ${radiusInKm}km
using max-trips: ${count}
`)

main()
