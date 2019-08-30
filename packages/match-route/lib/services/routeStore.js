const calc = require('../utils/calc')
const redis = require('../adapters/redis')()

const safeParse = require('../utils/safeParse')

const dumpAll = async prefix => {
  const routes = await redis.keys(prefix)

  return await (await Promise.all(
    routes.map(async key => {
      try {
        const result = await redis.get(key)

        return safeParse(result)
      } catch (_) {
        return null
      }
    })
  )).filter(x => x)
}

const lock = async id => {
  const response = await redis.get(id)
  const json = response
    ? {
        ...safeParse(response),
        locked: true,
      }
    : {}

  if (!Object.keys(json)) {
    return
  }

  await redis.set(id, JSON.stringify(json))

  return json
}

module.exports = {
  demo: {
    async clear () {
      await redis.flushall()
    },
  },
  persons: {
    async dump () {
      return await dumpAll('person_*')
    },
    async lock (id) {
      return lock(id.startsWith('person_') ? id : `person_${id}`)
    },
    async add (
      id = '',
      {
        passengers = 1,
        startDate = new Date().toISOString(),
        endDate = new Date().toISOString(),
        startPosition = { lat: 0, lon: 0 },
        endPosition = { lat: 0, lon: 0 },
      }
    ) {
      const personId = `person_${id}`

      await redis.geoadd(
        'person_start',
        startPosition.lon,
        startPosition.lat,
        personId
      )

      await redis.geoadd(
        'person_end',
        endPosition.lon,
        endPosition.lat,
        personId
      )

      await redis.set(
        personId,
        JSON.stringify({
          id: personId,
          passengers,
          startDate,
          endDate,
          startPosition,
          endPosition,
        })
      )

      return personId
    },
    async getClosest (
      startPoint = { lat: 0, lon: 0 },
      endPoint = { lat: 0, lon: 0 },
      startDate,
      endDate
    ) {
      const middle = calc.middlePoint(startPoint, endPoint)
      const distance = (calc.distance(startPoint, endPoint) / 2) * 1.1

      const start = await redis.georadius(
        'person_start',
        middle.lon,
        middle.lat,
        distance,
        'km'
      )

      const end = await redis.georadius(
        'person_end',
        middle.lon,
        middle.lat,
        distance,
        'km'
      )

      const matches = start.filter(id => end.includes(id))

      const results = await Promise.all(
        matches.map(async id => {
          const match = await redis.get(id)
          return safeParse(match)
        })
      )

      return results
        .filter(person => person && !person.locked)
        .filter(
          person => person.startDate === startDate && person.endDate === endDate
        )
    },
    async get (id = '') {
      const parsedId = id.startsWith('person_') ? id : `person_${id}`
      const response = await redis.get(parsedId)
      return safeParse(response)
    },
  },
  pending: {
    async dump () {
      return await dumpAll('pending_*')
    },
    async add (id, route) {
      const parsedId = id.startsWith('pending_') ? id : `pending_${id}`

      await redis.set(parsedId, JSON.stringify({ ...route, id: parsedId }))

      return parsedId
    },
    async get (id) {
      const response = await redis.get(
        id.startsWith('pending_') ? id : `pending_${id}`
      )

      const json = response ? safeParse(response) : {}

      if (json && !json.lock) {
        return json
      }

      return {}
    },
    async lock (id) {
      return lock(id.startsWith('pending_') ? id : `pending_${id}`)
    },
  },
  routes: {
    async dump () {
      return await dumpAll('routes_*')
    },
    async add (id, route) {
      const parsedId = id.startsWith('routes_') ? id : `routes_${id}`

      const stopsCopy = route.stops.slice()
      const [startPoint] = stopsCopy.splice(0, 1)
      const [endPoint] = stopsCopy.splice(stopsCopy.length - 1, 1)

      await redis.geoadd(
        'routes_start',
        startPoint.lon,
        startPoint.lat,
        parsedId
      )
      await redis.geoadd('routes_end', endPoint.lon, endPoint.lat, parsedId)
      await redis.set(parsedId, JSON.stringify({ ...route, id: parsedId }))

      return parsedId
    },
    async get (id) {
      const parsedId = id.startsWith('routes_') ? id : `routes_${id}`
      const response = await redis.get(parsedId)
      return safeParse(response)
    },
    async update (id, data) {
      const parsedId = id.startsWith('routes_') ? id : `routes_${id}`

      const pre = await redis.get(parsedId)
      const parsed = safeParse(pre)

      if (!parsed && !Object.keys(parsed).length) {
        return
      }

      const joined = {
        ...parsed,
        ...data,
        id: parsedId,
      }

      const stopsCopy = joined.stops.slice()
      const [startPoint] = stopsCopy.splice(0, 1)
      const [endPoint] = stopsCopy.splice(stopsCopy.length - 1, 1)

      await redis.geoadd(
        'routes_start',
        startPoint.lon,
        startPoint.lat,
        parsedId
      )
      await redis.geoadd('routes_end', endPoint.lon, endPoint.lat, parsedId)
      await redis.set(parsedId, JSON.stringify(joined))

      return joined
    },
    async getClosest (
      startPoint = { lat: 0, lon: 0 },
      endPoint = { lat: 0, lon: 0 },
      startDate,
      endDate
    ) {
      const middle = calc.middlePoint(startPoint, endPoint)
      const distance = (calc.distance(startPoint, endPoint) / 2) * 1.1

      const start = await redis.georadius(
        'routes_start',
        middle.lon,
        middle.lat,
        distance,
        'km'
      )

      const end = await redis.georadius(
        'routes_end',
        middle.lon,
        middle.lat,
        distance,
        'km'
      )

      const matches = start.filter(id => end.includes(id))

      const result = await Promise.all(
        matches.map(async id => {
          const match = await redis.get(id)
          return safeParse(match)
        })
      )

      return result.filter(
        route => route.startDate === startDate && route.endDate === endDate
      )
    },
  },
}
