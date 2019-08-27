const osrm = require('../adapters/osrm')

const latLon = ({ lat, lon }) => `${lon},${lat}`

const toHours = duration => duration / 60 / 60

module.exports = {
  async nearest (position) {
    const { data } = await osrm.get(`/nearest/v1/driving/${latLon(position)}`)

    return data
  },

  async bestMatch ({ startPosition, endPosition, permutations = [], maxTime }) {
    return (await Promise.all(
      permutations.map(async ({ coords, ids }) => {
        const data = await this.route({
          startPosition,
          endPosition,
          extras: coords,
        })

        const {
          routes: [{ duration: routeDuration, distance, geometry }],
        } = data

        const duration = toHours(routeDuration)
        return {
          defaultRoute: data,
          geometry,
          duration,
          stops: [startPosition, ...coords, endPosition],
          distance,
          coords,
          ids,
        }
      })
    ))
      .sort((a, b) => (a.diff < b.diff ? 1 : b.diff < a.diff ? -1 : 0))
      .filter(({ duration }) => duration < maxTime)
      .pop()
  },

  isStartCoordinate (coordinate) {
    const [key] = Object.keys(coordinate)
    return key.endsWith('1')
  },

  correspondingStartCoordIsInPermutation (element, list) {
    const [key] = Object.keys(element)
    return list.some(e => Object.keys(e)[0] === key[0] + '1')
  },

  convertPairsIntoIdentifiedPoints (pairs) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const translations = pairs.reduce(
      (res, { id }, i) => ({
        ...res,
        [alphabet[i]]: id,
      }),
      {}
    )
    return [
      pairs.reduce((res, { startPosition, endPosition }, i) => {
        const identifier = alphabet[i]

        res.push(
          {
            [identifier + '1']: startPosition,
          },
          {
            [identifier + '2']: endPosition,
          }
        )

        return res
      }, []),
      translations,
    ]
  },

  getPermutationsWithoutIds (input, start, stop) {
    const result = []
    for (let i = 0; i <= input.length; i++) {
      for (let j = i + 1; j <= input.length + 1; j++) {
        const copy = input.slice()
        copy.splice(i, 0, start)
        copy.splice(j, 0, stop)
        result.push(copy)
      }
    }

    return result
  },

  noOfStartingpointsLimitReached (array, permutationMaxLength) {
    return (
      array.filter(this.isStartCoordinate).length >= permutationMaxLength / 2
    )
  },

  getPermutations (input, emptySeats) {
    const permutationMaxLength = emptySeats * 2
    const result = []
    const [listOfPoints, translations] = this.convertPairsIntoIdentifiedPoints(
      input
    )

    const permute = (arr, permutation = []) => {
      if (arr.length === 0 || permutation.length >= permutationMaxLength) {
        result.push(permutation)
      } else {
        for (let i = 0; i < arr.length; i++) {
          const arrayCopy = arr.slice()
          const [next] = arrayCopy.splice(i, 1)
          if (
            this.isStartCoordinate(next) &&
            this.noOfStartingpointsLimitReached(
              permutation,
              permutationMaxLength
            )
          ) {
            continue
          } else if (
            this.isStartCoordinate(next) ||
            this.correspondingStartCoordIsInPermutation(next, permutation)
          ) {
            permute(arrayCopy, permutation.concat([next]))
          }
        }
      }
    }

    permute(listOfPoints)

    return result.reduce((res, permutation) => {
      res.push({
        ids: permutation
          .map(point => Object.keys(point)[0])
          .filter(identifier => identifier.endsWith('1'))
          .map(identifier => translations[identifier[0]]),
        coords: permutation.map(point => Object.values(point)[0]),
      })
      return res
    }, [])
  },

  async route ({ startPosition, endPosition, extras = [] }) {
    const destinations = [startPosition, ...extras, endPosition]
      .filter(x => x)
      .map(latLon)
      .join(';')

    const url = `/route/v1/driving/${destinations}?geometries=geojson&overview=full`

    const { data } = await osrm.get(url)

    return data
  },
}
