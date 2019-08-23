const { destination } = require('../config')
const routeApi = require('../adapters/routeApi')

const newRoute = async startPosition => {
  const date = new Date().toISOString().split('T')[0]

  const { data } = await routeApi.post(
    Math.random() > 0.5 ? '/route' : '/pickup',
    {
      start: {
        date,
        position: startPosition,
      },
      end: {
        date,
        position: destination,
      },
    }
  )

  return data
}

module.exports = {
  newRoute,
}
