const uuid = require('uuid/v4')
const redisClient = require('../adapters/redis')
const hasProp = require('../utils/hasProp')
const safeParse = require('../utils/safeParse')

const redis = redisClient()
const pub = redisClient()

const routeService = require('../services/route')

const routeStore = require('../services/routeStore')

// const persons = []
// const routes = {}
// const pendingRoutes = {}

module.exports = (app, io) => {
  redis.psubscribe('changeRequested:*', (err, count) => console.log(count))
  redis.psubscribe('routeCreated:*', (err, count) => console.log(count))

  io.on('connection', client => {
    const { id: socketId, emit } = client
    const id = JSON.stringify(socketId)

    console.log('socket connected', socketId)

    client.on('event', async eventData => {
      console.log('event received:', eventData)
      const event = safeParse(eventData)

      if (!hasProp(event, 'type') || !hasProp(event, 'payload')) {
        return
      }

      const { type, payload } = event

      switch (type.toLowerCase()) {
        case 'driver':
          {
            const routeId = uuid()
            const route = await routeService.getBestRoute(payload)

            console.log('Driver found passengers', route)

            io.to(socketId).emit('changeRequested', routeId)
            await pub.lpush(routeId, id)

            await routeService.addPendingTrip(routeId, route)
          }
          break
        case 'passenger':
          {
            const bestMatch = await routeService.getMatchForPassenger(payload)

            if (
              bestMatch &&
              hasProp(bestMatch, 'match') &&
              hasProp(bestMatch, 'id')
            ) {
              const passengerId = uuid()
              const { match, id } = bestMatch
              match.ids = [passengerId]
              await routeService.addPendingTrip(id, match)

              await pub.publish(`changeRequested:${id}`, passengerId)
              // const sockets = await pub.get(passengerId)
              await pub.lpush(passengerId, id)

              break
            }

            const passengerId = await routeService.addPersonToList(payload)
            console.log('no match found, subscribing to id:', passengerId)
            await pub.lpush(passengerId, id)
          }
          break
        case 'acceptChange':
          {
            const { id } = payload
            const route = await routeStore.pending.get(id)

            if (!route || !hasProp(route, 'ids') || !Array.isArray(route.ids)) {
              break
            }

            console.log('Driver accepted', route)

            try {
              await Promise.all(
                route.ids.map(passengerId =>
                  pub.publish(`routeCreated:${passengerId}`, id)
                )
              )
            } catch (error) {
              console.log('error sending to clients', error)
            }

            await routeStore.pending.lock(id)
            await routeStore.routes.add(id, route)

            emit('congrats', id)
            // remove passenger from list
          }
          break
      }
    })
  })

  redis.on('pmessage', async (pattern, channel, msg) => {
    console.log('message recevied', pattern, channel, msg)
    const id = channel.replace(pattern.replace('*', ''), '')

    const socketIds = await pub.lrange(id, 0, -1).then(JSON.parse)
    console.log({ socketIds })

    switch (pattern.toLowerCase()) {
      case 'routeCreated:*':
        console.log(`congrats to ${socketIds}, routeId: ${msg}`)
        io.to(socketIds).emit('congrats', msg)
        break
      case 'changeRequested:*':
        io.to(socketIds).emit('changeRequested', id)
        break
      case 'tripUpdated':
        io.to(socketIds).emit('tripUpdated', id)
        break
      default:
        console.log('Unhandled redis message ', pattern)
    }
  })

  app.post('/pickup', async (req, res) => {
    const bestMatch = await routeService.getMatchForPassenger(req.body)

    if (!bestMatch || !hasProp(bestMatch, 'match') || !bestMatch.match) {
      routeService.addPersonToList(req.body)
      res.sendStatus(200)
      return
    }

    const match = bestMatch.match
    const result = {
      route: match.defaultRoute,
      distance: match.distance,
      stops: match.stops,
      duration: match.duration,
    }

    res.send(result)
  })

  app.post('/route', async (req, res) => {
    try {
      const id = uuid()
      const result = await routeService.getBestRoute(req.body)

      await routeStore.routes.add(id, result)

      res.send({ id, ...result })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

  app.get('/route/:id', async ({ params: { id } }, res) => {
    console.log('received msg', id)

    const route = await routeStore.routes.get(id)

    if (!route) {
      return res.sendStatus(400)
    }

    res.send(route)
  })

  app.get('/pending-route/:id', async ({ params: { id } }, res) => {
    const route = await routeStore.pending.get(id)

    if (!route) {
      return res.sendStatus(400)
    }

    console.log('returning ', route)

    res.send(route)
  })
}
