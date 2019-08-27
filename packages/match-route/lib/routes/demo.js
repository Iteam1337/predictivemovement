const routeStore = require('../services/routeStore')
const hasProp = require('../utils/hasProp')

const reasonCheckForNullSoThatThingsDontBreak = object =>
  object
    && hasProp(object, 'distance')
    && hasProp(object, 'duration')
    && hasProp(object, 'stops')
    && hasProp(object, 'maxTime')
    && Array.isArray(object.stops)
    // && (object.stops.length ? (hasProp(object.stops[0], 'lat') && hasProp(object.stops[0], 'lng')) : true)

module.exports = app => {
  app.get('/demo/pending', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send({
      data: Object.values(dump).filter(Boolean).filter(reasonCheckForNullSoThatThingsDontBreak)
    })
  })

  app.get('/demo/pending/locked', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send(dump.filter(pending => pending.locked))
  })

  app.get('/demo/pending/unlocked', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send(Object.values(dump.filter(pending => !pending.locked)))
  })

  app.get('/demo/routes', async (_, res) => {
    const dump = await routeStore.routes.dump()

    res.send({
      data: Object.values(dump).filter(Boolean).filter(reasonCheckForNullSoThatThingsDontBreak),
    })
  })

  app.get('/demo/persons', async (_, res) => {
    const dump = await routeStore.persons.dump()
    res.send(dump)
  })

  app.get('/demo/clear', async (_, res) => {
    await routeStore.demo.clear()
    res.send(null)
  })
}
