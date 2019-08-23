const { destination } = require('../config')

const genPayload = startPosition => {
  const date = new Date().toISOString().split('T')[0]
  return {
    start: {
      date,
      position: startPosition,
    },
    end: {
      date,
      position: destination,
    },
  }
}


module.exports = genPayload
