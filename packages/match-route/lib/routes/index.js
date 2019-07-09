const uuid = require('uuid/v4')

const osrm = require('../services/osrm')

const persons = []
const routes = {}

module.exports = app => {
  app.post(
    '/pickup',
    ({
        body: {
          passengers = 1,
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
      // Object.entries(routes).map(([id, value]) => {
      //   const stopsCopy = value.stops.slice()
      //   const startPosition = stopsCopy.splice(0, 1)
      //   const endPosition = stopsCopy.splice(value.stops.length - 1, 1)
      //   stopsCopy.push()
      //   // extras = [{id, startPosition, endPosition}]
      //   const permutations = osrm.getPermutationsWithoutIds(stopsCopy)
      //   osrm.bestMatch({
      //     startPosition,
      //     endPosition,
      //     permutations,
      //     maxTime: value.maxTime
      //   })
      //   console.log(value.stops)
      // })
      persons.push({
        id: uuid(),
        passengers,
        startDate,
        startPosition,
        endDate,
        endPosition,
      })

      res.sendStatus(200)
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