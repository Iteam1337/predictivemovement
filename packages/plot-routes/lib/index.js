const { count } = require('./config')
const { randomize } = require('./services/adress')
const { newRoute, newPickup } = require('./services/routeApi')

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
    const isDriver = Math.random() > 0.5
    const label = isDriver ? 'driver' : 'passenger'
    try {
      sockets.push(isDriver ? await newPickup(point) : await newRoute(point))
      console.log(`added ${label}`)
    } catch (error) {
      console.error(error)
      console.log(`failed to add ${label}`)
    }
  }

  console.log(
    `handled ${sockets.length} requests${
      sockets.length !== points.length ? ` (${points.length} possible)` : ''
    }`
  )

  await Promise.allSettled(sockets.map(async socket => await socket.close()))
}

main()
