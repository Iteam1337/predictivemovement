const routeStore = require('../services/routeStore')
const osrm = require('../services/osrm')
const hasProp = require('../utils/hasProp')

const keepStructure = object => {
  const data = Object.values(object).filter(
    object =>
      object != null &&
      hasProp(object, 'distance') &&
      hasProp(object, 'duration') &&
      hasProp(object, 'stops') &&
      hasProp(object, 'maxTime') &&
      Array.isArray(object.stops)
  )

  data.forEach(data => {
    data.stops = data.stops.filter(
      stop => hasProp(stop, 'lat') && hasProp(stop, 'lon')
    )
  })

  return data
}

module.exports = app => {
  app.get('/demo/pending', async (_, res) => {
    res.send({
      data: keepStructure(await routeStore.pending.dump()),
    })
  })

  app.get('/demo/pending/locked', async (_, res) => {
    res.send(
      (await routeStore.pending.dump()).filter(
        pending => pending.locked != null
      )
    )
  })

  app.get('/demo/pending/unlocked', async (_, res) => {
    res.send(
      Object.values(
        (await routeStore.pending.dump()).filter(
          pending => pending.locked == null
        )
      )
    )
  })

  app.get('/demo/routes', async (_, res) => {
    res.send({
      data: keepStructure(await routeStore.routes.dump()),
    })
  })

  app.get('/demo/route/:id', async ({ params: { id } }, res) => {
    const route = await routeStore.routes.get(id)

    if (!route) {
      return res.sendStatus(400)
    }

    const { 0: driverStart, [route.stops.length - 1]: driverEnd } = route.stops
    const result = await osrm.geoJSON({ stops: [driverStart, driverEnd] })

    const json = [
      {
        id,
        stops: [driverStart, driverEnd],
        geometry: result.geometry,
        waypoints: result.waypoints,
      },
    ]

    for (const id of route.ids) {
      const { startPosition, endPosition } = await routeStore.persons.get(id)
      const result = await osrm.geoJSON({ stops: [startPosition, endPosition] })
      json.push({
        id,
        stops: [startPosition, endPosition],
        geometry: result.geometry,
        waypoints: result.waypoints,
      })
    }

    res.send(json)
  })

  app.get('/demo/persons', async (_, res) => {
    res.send(await routeStore.persons.dump())
  })

  app.get('/demo/clear', async (_, res) => {
    await routeStore.demo.clear()
    res.send(null)
  })
}
