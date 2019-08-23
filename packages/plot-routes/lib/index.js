const { randomize } = require('./services/adress')

const { newRoute, newPickup } = require('./services/routeApi')

const main = async () => {
  const points = []
  const sockets = []

  for (let i = 0; i < 3; i++) {
    let random
    try {
      random = await randomize()
      points.push(random)
    } catch (_) {
      //
    }
  }

  for (const point of points.splice(0, Math.ceil(points.length / 2))) {
    sockets.push(await newPickup(point))
    console.log('added passenger')
  }

  for (const point of points) {
    sockets.push(await newRoute(point))
    console.log('added driver')
  }

  console.log(sockets.map(({ io: { readyState } }) => console.log({ readyState })))

  console.log(sockets)
}

main()
