const osrm = require('../adapters/osrm')

const latLon = ({
  lat,
  lon
}) => `${lon},${lat}`

const toHours = duration => duration / 60 / 60

module.exports = {
  async nearest (position) {
    const {
      data
    } = await osrm.get(`/nearest/v1/driving/${latLon(position)}`)

    return data
  },

  async bestMatch ({
    startPosition,
    endPosition,
    extras = [],
    maximumAddedTimePercent = 100,
    emptySeats
  }) {
    const defaultRoute = await this.route({
      startPosition,
      endPosition
    })
    const defaultRouteDuration = toHours(defaultRoute.routes[0].duration)
    const maxExtraTime = defaultRouteDuration * (maximumAddedTimePercent / 100)

    const permutations = this.getPermutations(extras, emptySeats)
    return (await Promise.all(
        permutations.map(async ({
          coords
        }) => {
          const data = await this.route({
            startPosition,
            endPosition,
            extras: coords,
          })

          const {
            routes: [{
              duration: routeDuration,
              distance
            }],
          } = data

          const duration = toHours(routeDuration)
          return {
            duration,
            diff: duration - defaultRouteDuration,
            stops: [startPosition, ...coords, endPosition],
            distance,
            coords,
          }
        })
      ))
      .sort((a, b) => (a.diff < b.diff ? 1 : b.diff < a.diff ? -1 : 0))
      .filter(({
        diff
      }) => diff < maxExtraTime)
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
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const translations = pairs.map(({
      id
    }, i) => ({
      [alphabet[i]]: id
    }))
    return [pairs.reduce((res, {
      startPosition,
      endPosition
    }, i) => {
      const identifier = alphabet[i]
      res.push({
        [identifier + '1']: startPosition
      }, {
        [identifier + '2']: endPosition
      })

      return res
    }, []), translations]
  },

  getPermutations (input, _permutationLength) {
    const result = []
    const [listOfPoints, translations] = this.convertPairsIntoIdentifiedPoints(input)

    const permute = (arr, permutation = []) => {
      if (arr.length === 0) {
        result.push(permutation)
      } else {
        for (let i = 0; i < arr.length; i++) {
          const arrayCopy = arr.slice()
          const next = arrayCopy.splice(i, 1).pop()
          if (this.isStartCoordinate(next) || this.correspondingStartCoordIsInPermutation(next, permutation)) {
            permute(arrayCopy, permutation.concat([next]))
          }
        }
      }
    }
    permute(listOfPoints)

    return result.reduce((res, permutation) => {
      res.push({
        ids: permutation.map(point => Object.keys(point)[0]).filter(identifier => identifier.endsWith("1")).map(identifier => translations[identifier]),
        coords: permutation.map(point => Object.values(point)[0])
      })
      return res
    }, [])
  },

  async route ({
    startPosition,
    endPosition,
    extras = []
  }) {
    const destinations = [
        startPosition,
        ...extras,
        endPosition,
      ]
      .filter(x => x)
      .map(latLon)
      .join(';')

    const url = `/route/v1/driving/${destinations}`

    const {
      data
    } = await osrm.get(url)

    return data
  },
}