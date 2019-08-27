const uuid = require('uuid/v4')
const osrm = require('../services/osrm')

const routeStore = require('./routeStore')

const addPendingTrip = async (id, route) =>
  // pendingRoutes[id] = trip
  await routeStore.pending.add(id, route)

const addPersonToList = async person => {
  const id = uuid()

  await routeStore.persons.add(id, {
    passengers: person.passengers,
    startDate: person.start.date,
    endDate: person.end.date,
    startPosition: person.start.position,
    endPosition: person.end.position,
  })

  // persons.push({
  //   id,
  //   passengers: person.passengers,
  //   startDate: person.start.date,
  //   endDate: person.end.date,
  //   startPosition: person.start.position,
  //   endPosition: person.end.position,
  // })

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

  return Promise.all(
    Object.entries(routes).map(async ([id, value]) => {
      const stopsCopy = value.stops.slice()
      const [driverStartPosition] = stopsCopy.splice(0, 1)
      const [driverEndPosition] = stopsCopy.splice(stopsCopy.length - 1, 1)
      const permutations = osrm.getPermutationsWithoutIds(
        stopsCopy,
        passengerStartPosition,
        passengerEndPosition
      )
      const p = permutations.map(p => ({ coords: p }))
      const match = await osrm.bestMatch({
        startPosition: driverStartPosition,
        endPosition: driverEndPosition,
        permutations: p,
        maxTime: value.maxTime,
      })
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
  ).then(matches => matches.pop())
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

  const permutations = osrm.getPermutations(persons, emptySeats)

  const bestMatch =
    (await osrm.bestMatch({
      startPosition,
      endPosition,
      permutations,
      maxTime,
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
