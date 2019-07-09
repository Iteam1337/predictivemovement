const osrm = require('../adapters/osrm')

const latLon = ({ lat, lon }) => `${lon},${lat}`

const toHours = duration => duration / 60 / 60

module.exports = {
  async nearest (position) {
    const { data } = await osrm.get(`/nearest/v1/driving/${latLon(position)}`)

    return data
  },

  async bestMatch ({ startPosition, endPosition, extras = [] }) {
    const defaultRoute = await this.route({ startPosition, endPosition })
    const defaultRouteDuration = toHours(defaultRoute.routes[0].duration)

    return (await Promise.all(
      extras.map(async extra => {
        const data = await this.route({
          startPosition,
          endPosition,
          extras: [extra],
        })

        const {
          routes: [{ duration: routeDuration, distance }],
        } = data

        const duration = toHours(routeDuration)

        return {
          duration,
          diff: duration - defaultRouteDuration,
          stops: [
            startPosition,
            extra.startPosition,
            extra.endPosition,
            endPosition,
          ],
          distance,
          extra,
        }
      })
    ))
      .sort((a, b) => (a.diff < b.diff ? 1 : b.diff < a.diff ? -1 : 0))
      .filter(({ diff }) => diff < defaultRouteDuration / 5)
      .pop()
  },

  isStartCoordinate (coordinate) {
    return coordinate.endsWith('1')
  },

  correspondingStartCoordIsInPermutation (element, list) {
    const identifier = element[0]
    return list.includes(identifier + '1')
  },

  getPermutations (input) {
    const result = []

    const permute = (arr, permutation = []) => {
      if (arr.length === 0) {
        result.push(permutation)
      } else {
        for (let i = 0; i < arr.length; i++) {
          const arrayCopy = arr.slice()
          const next = arrayCopy.splice(i, 1).pop()
          if (
            this.isStartCoordinate(next) ||
            this.correspondingStartCoordIsInPermutation(next, permutation)
          ) {
            permute(arrayCopy, permutation.concat([next]))
          }
        }
      }
    }

    permute(input)

    return result
  },

  async route ({ startPosition, endPosition, extras = [] }) {
    const destinations = [
      startPosition,
      ...extras.reduce(
        (array, { startPosition, endPosition }) =>
          array.concat(startPosition, endPosition),
        []
      ),
      endPosition,
    ]
      .filter(x => x)
      .map(latLon)
      .join(';')

    const url = `/route/v1/driving/${destinations}`

    const { data } = await osrm.get(url)

    return data
  },
}
