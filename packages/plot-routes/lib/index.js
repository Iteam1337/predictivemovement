const { randomize } = require('./services/adress')

const { newRoute } = require('./services/routeApi')

const main = async () => {
  const points = []

  for (let i = 0; i < 100; i++) {
    let random
    try {
      random = await randomize()
      points.push(random)
    } catch (_) {}
  }


  const results = await Promise.allSettled(points.map(async point => await newRoute(point)))

  console.log(results)
}

main()
