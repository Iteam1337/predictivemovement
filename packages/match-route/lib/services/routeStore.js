const calc = require('../utils/calc')
const redis = require('../adapters/redis')()

const safeParse = require('../utils/safeParse')

module.exports = {
  persons: {
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
      await redis.geoadd(
        'person_start',
        startPosition.lon,
        startPosition.lat,
        id
      )
      await redis.geoadd('person_end', endPosition.lon, endPosition.lat, id)
      await redis.set(
        id,
        JSON.stringify({
          id,
          passengers,
          startDate,
          endDate,
          startPosition,
          endPosition,
        })
      )
    },
    async getClosest (
      startPoint = { lat: 0, lon: 0 },
      endPoint = { lat: 0, lon: 0 }
    ) {
      const middle = calc.middlePoint(startPoint, endPoint)
      const distance = (calc.distance(startPoint, endPoint) / 2) * 1.1

      const start = await redis.georadius(
        'person_start',
        middle.lat,
        middle.lon,
        distance,
        'km'
      )

      const end = await redis.georadius(
        'person_end',
        middle.lat,
        middle.lon,
        distance,
        'km'
      )

      console.log({ start, end })

      return []
    },
    async get (id = '') {
      const response = await redis.get(id)
      return response ? safeParse(response) : {}
    },
  },
  pending: {
    async add (id, route) {},
    async get (id) {
      const response = await redis.get(id)
      const json = response ? safeParse(response) : {}

      if (json && !json.lock) {
        return json
      }

      return {}
    },
    async getClosest (startPoint, endPoint) {},
    async lock (id) {},
  },
  routes: {
    async add (id, route) {},
    async get (id) {},
    async update (id, data) {},
    async getClosest (
      startPoint = { lat: 0, lon: 0 },
      endPoint = { lat: 0, lon: 0 }
    ) {},
  },
}
