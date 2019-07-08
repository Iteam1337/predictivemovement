const osrm = require('../adapters/osrm')

const latLon = ({ lat, lon }) => `${lon},${lat}`

const toHours = duration => duration / 60 / 60

// const bestMatches = async ({
//   startPosition,
//   endPosition,
//   defaultRouteDuration,
//   stops,
// }) => {
//   const done = false
//   do {
//     done = true
//   }
//   while (!done)

//   return (await Promise.all(
//     extras.map(async extra => {
//       const data = await this.route({
//         startPosition,
//         endPosition,
//         extras: [extra],
//       })

//       const {
//         routes: [{ duration: routeDuration, distance }],
//       } = data

//       const duration = toHours(routeDuration)

//       return {
//         duration,
//         diff: duration - defaultRouteDuration,
//         stops: [
//           startPosition,
//           extra.startPosition,
//           extra.endPosition,
//           endPosition,
//         ],
//         distance,
//         extra,
//       }
//     })
//   )).sort((a, b) => (a.diff < b.diff ? 1 : b.diff < a.diff ? -1 : 0))
// }

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
