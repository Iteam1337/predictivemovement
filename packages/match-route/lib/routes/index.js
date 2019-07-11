const uuid = require('uuid/v4')
const osrm = require('../services/osrm')
const {
  pub,
  redis
} = require('../adapters/redis')

const persons = []
const routes = {}
const pendingRoutes = {}

module.exports = (app, io) => {
  io.on('connection', client => {
    client.on('event', async e => {
      console.log('event received:', e)
      const event = JSON.parse(e)
      if (event.type === "driver") {
        const routeId = uuid()
        const route = await getBestRoute(event.payload)
        console.log('Driver found passengers', route)
        client.emit('changeRequested', routeId)

        redis.subscribe(routeId)
        addPendingTrip(routeId, route)
      } else if (event.type === 'passenger') {
        const passengerId = uuid()
        const bestMatch = await getMatchForPassenger(event.payload)
        if (bestMatch) {
          const {
            match,
            id
          } = bestMatch
          console.log('bestMatch', bestMatch)
          match.ids = [passengerId]
          addPendingTrip(id, match)
          console.log('pendingRoutes', pendingRoutes)

          pub.publish(id, 'changeRequested')
          redis.subscribe(id)
        } else {
          const passengerId = addPersonToList(event.payload)
          console.log('no match found, subscribing to id:', passengerId)

          redis.subscribe(passengerId)
        }
      } else if (event.type === "acceptChange") {
        const {
          id
        } = event.payload
        const route = pendingRoutes[id]
        console.log('Driver accepted', route)
        try {
          await Promise.all(route.ids.map(passengerId => pub.publish(passengerId, `routeCreated:${id}`)))
        } catch (e) {
          console.log('error sending to clients', e)
        }
        delete pendingRoutes[id]
        routes[id] = route
        pub.publish(id, `routeCreated:${id}`)
      }
    })

    redis.on('message', (id, type) => {
      if (type.startsWith('routeCreated:')) {
        console.log('Driver paired with passengers')

        const newId = type.replace('routeCreated:', '')
        console.log('new', newId)
        redis.subscribe(newId)
        client.emit('congrats', newId)
      } else if (type === 'changeRequested') {
        client.emit('changeRequested', id)
      } else if (type === 'tripUpdated') {
        client.emit('tripUpdated', id)
      } else {
        console.log('Unhandled redis message ', type)
      }
    })
  })

  function addPendingTrip (id, trip) {
    pendingRoutes[id] = trip
  }

  function addPersonToList (person) {
    const id = uuid()
    persons.push({
      id,
      passengers: person.passengers,
      startDate: person.start.date,
      endDate: person.end.date,
      startPosition: person.start.position,
      endPosition: person.end.position,
    })
    return id
  }

  function getMatchForPassenger ({
    passengers = 1,
    start: {
      date: startDate,
      position: passengerStartPosition
    },
    end: {
      date: endDate,
      position: passengerEndPosition
    },
  }) {
    return Promise.all(Object.entries(routes).map(async ([id, value]) => {
        const stopsCopy = value.stops.slice()
        const [driverStartPosition] = stopsCopy.splice(0, 1)
        const [driverEndPosition] = stopsCopy.splice(stopsCopy.length - 1, 1)
        const permutations = osrm.getPermutationsWithoutIds(stopsCopy, passengerStartPosition, passengerEndPosition)
        const p = permutations.map(p => ({
          coords: p
        }))
        const match = await osrm.bestMatch({
          startPosition: driverStartPosition,
          endPosition: driverEndPosition,
          permutations: p,
          maxTime: value.maxTime
        })
        return {
          id,
          match
        }
      }))
      .then(matches => matches.pop())
  }
  app.post(
    '/pickup', async (req, res) => {
      const bestMatch = await getMatchForPassenger(req.body)
      if (bestMatch) {
        const match = bestMatch.match
        const result = {
          route: match.defaultRoute,
          distance: match.distance,
          stops: match.stops,
          duration: match.duration,
        }
        res.send(result)
      } else {
        addPersonToList(req.body)
        res.sendStatus(200)
      }
    }
  )

  async function getBestRoute ({
    maximumAddedTimePercent = 50,
    emptySeats = 4,
    start: {
      date: startDate,
      position: startPosition
    },
    end: {
      date: endDate,
      position: endPosition
    },
  }) {
    const defaultRoute = await osrm.route({
      startPosition,
      endPosition,
    })
    const toHours = duration => duration / 60 / 60

    const defaultRouteDuration = toHours(defaultRoute.routes[0].duration)
    const maxTime = defaultRouteDuration + defaultRouteDuration * (maximumAddedTimePercent / 100)
    const permutations = osrm.getPermutations(persons, emptySeats)

    const bestMatch =
      (await osrm.bestMatch({
        startPosition,
        endPosition,
        permutations,
        maxTime
      })) || {}

    console.log({
      bestMatch,
      emptySeats,
      startDate,
      startPosition,
      endDate,
      endPosition,
    })

    const result = {
      maxTime,
      route: bestMatch.defaultRoute,
      distance: bestMatch.distance,
      stops: bestMatch.stops,
      duration: bestMatch.duration,
      ids: bestMatch.ids
    }

    return result
  }
  app.post('/route', async (req, res) => {
    console.log('passengers', persons)

    try {
      const id = uuid()
      const result = await getBestRoute(req.body)
      routes[id] = result
      res.send({
        id,
        ...result,
      })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }

  })

  app.get('/route/:id', ({
    params: {
      id
    }
  }, res) => {
    const route = routes[id]

    if (!route) {
      return res.sendStatus(400)
    }

    res.send(route)
  })

  app.get('/pending-route/:id', ({
    params: {
      id
    }
  }, res) => {
    const route = pendingRoutes[id]

    if (!route) {
      return res.sendStatus(400)
    }

    res.send(route)
  })
}