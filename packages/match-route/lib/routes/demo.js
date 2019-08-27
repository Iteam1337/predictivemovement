const routeStore = require('../services/routeStore')

module.exports = app => {
  app.get('/demo/pending', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send(dump)
  })

  app.get('/demo/pending/locked', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send(dump.filter(pending => pending.locked))
  })

  app.get('/demo/pending/unlocked', async (_, res) => {
    const dump = await routeStore.pending.dump()
    res.send(dump.filter(pending => !pending.locked))
  })

  app.get('/demo/routes', async (_, res) => {
    const dump = await routeStore.routes.dump()
    res.send(dump)
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
