const uuid = require('uuid/v4')
const osrm = require('../services/osrm')

const routeStore = require('./routeStore')

const addPendingTrip = async (id, route) =>
  await routeStore.pending.add(id, route)

const addPersonToList = async person => {
  const id = await routeStore.persons.add(uuid(), {
    passengers: person.passengers,
    startDate: person.start.date,
    endDate: person.end.date,
    startPosition: person.start.position,
    endPosition: person.end.position,
  })

  console.log(`added user ${id}`)

  return id
}

const getMatchForPassenger = async ({
  // _passengers = 1,
  start: {
    // date: startDate,
    position: passengerStartPosition,
  },
  end: {
    // date: endDate,
    position: passengerEndPosition,
  },
}) => {
  const routes = await routeStore.routes.getClosest(
    passengerStartPosition,
    passengerEndPosition
  )

  const matches = await Promise.all(
    routes.map(async ({ id, stops, maxTime }) => {
      const stopsCopy = JSON.parse(JSON.stringify(stops))
      const {
        0: driverStartPosition,
        [stopsCopy.length - 1]: driverEndPosition,
      } = stopsCopy
      const permutations = osrm.getPermutationsWithoutIds(
        stopsCopy,
        passengerStartPosition,
        passengerEndPosition
      )

      const match = await osrm.bestMatch({
        startPosition: driverStartPosition,
        endPosition: driverEndPosition,
        permutations: permutations.map(p => ({ coords: p })),
        maxTime
      })

      if (!match) {
        return
      }

      return {
        id,
        match: {
          route: match.defaultRoute,
          distance: match.distance,
          stops: match.stops,
          duration: match.duration,
          ids: match.ids,
        },
      }
    })
  )

  return matches && matches.length ? matches[0] : {}
}

const getBestRoute = async ({
  maximumAddedTimePercent = 50,
  emptySeats = 3,
  start: { date: startDate, position: startPosition },
  end: { date: endDate, position: endPosition },
}) => {
  const defaultRoute = await osrm.route({
    startPosition,
    endPosition,
  })
  const toHours = duration => duration / 60 / 60

  const defaultRouteDuration = toHours(defaultRoute.routes[0].duration)
  const maxTime =
    defaultRouteDuration +
    defaultRouteDuration * (maximumAddedTimePercent / 100)

  const persons = await routeStore.persons.getClosest(
    startPosition,
    endPosition
  )

  const permutations = await osrm.getPermutations(persons, emptySeats)

  const bestMatch =
    (await osrm.bestMatch({
      startPosition,
      endPosition,
      permutations,
      maxTime,
    })) || {}

  const result = {
    maxTime,
    route: bestMatch.defaultRoute,
    distance: bestMatch.distance,
    stops: bestMatch.stops,
    duration: bestMatch.duration,
    ids: bestMatch.ids,
  }

  return result
}

module.exports = {
  addPendingTrip,
  addPersonToList,
  getMatchForPassenger,
  getBestRoute,
}
