const uuid = require('uuid/v4')

const osrm = require('../services/osrm')

const persons = []
const routes = {}

module.exports = app => {
  app.post(
    '/pickup',
    async ({
        body: {
          passengers = 1,
          start: {
            date: startDate,
            position: passengerStartPosition
          },
          end: {
            date: endDate,
            position: passengerEndPosition
          },
        },
      },
      res
    ) => {
      const bestMatches = await Promise.all(Object.entries(routes).map(async ([id, value]) => {
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
      })).catch(console.log)
      if (bestMatches.length) {
        const {
          match
        } = bestMatches.pop()
        const result = {
          route: match.defaultRoute,
          distance: match.distance,
          stops: match.stops,
          duration: match.duration,
        }
        console.log(routes)
        res.send(result)
      } else {
        persons.push({
          id: uuid(),
          passengers,
          startDate,
          endDate,
          startPosition: passengerStartPosition,
          endPosition: passengerEndPosition,
        })
        res.sendStatus(200)
      }
    }
  )

  app.post(
    '/route',
    async ({
        body: {
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
        },
      },
      res
    ) => {
      try {
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

        const id = uuid()

        const result = {
          maxTime,
          route: bestMatch.defaultRoute,
          distance: bestMatch.distance,
          stops: bestMatch.stops,
          duration: bestMatch.duration,
        }

        routes[id] = result
        console.log(routes)

        res.send({
          id,
          ...result,
        })
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    }
  )

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
}