const uuid = require('uuid/v4')

const osrm = require('../services/osrm')

const persons = []

module.exports = app => {
  app.post(
    '/person',
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
      persons.push({
        id: uuid(),
        passengers,
        startDate,
        startPosition,
        endDate,
        endPosition,
      })

      console.log(JSON.stringify(persons, null, 2))

      res.sendStatus(200)
    }
  )

  app.post(
    '/car',
    async ({
        body: {
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
          extras: [],
        }) || {}

        const bestMatch =
          (await osrm.bestMatch({
            startPosition,
            endPosition,
            extras: persons,
            emptySeats
          })) || {}

        console.log({
          defaultRoute,
          bestMatch,
          emptySeats,
          startDate,
          startPosition,
          endDate,
          endPosition,
        })

        res.send({
          route: defaultRoute,
          distance: bestMatch.distance,
          stops: bestMatch.stops,
          duration: bestMatch.duration,
        })
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    }
  )
}