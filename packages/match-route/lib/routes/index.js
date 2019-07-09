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
      const defaultRoute = await osrm.route({
        startPosition,
        endPosition,
      })

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
        distance: bestMatch.distance,
        stops: bestMatch.stops,
        duration: bestMatch.duration,
      })
    }
  )
}