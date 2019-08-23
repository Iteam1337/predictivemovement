const osrm = require('./osrm')
const { destination } = require('../config')

const genRandomPoint = () => {
  const r = 10000 / 111300
  const y0 = destination.lat
  const x0 = destination.lon
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y1 = w * Math.sin(t)
  const x1 = x / Math.cos(y0)

  return {
    lon: Math.random() > 0.5 ? x0 + x1 : x0 - x1,
    lat: Math.random() > 0.5 ? y0 + y1 : y0 - y1,
  }
}

const randomize = async (center = genRandomPoint(), count = 0) => {
  if (count > 25) {
    throw new Error(`Randomize in loop try nr ${count}`)
  }

  const {
    waypoints: [nearest],
  } = await osrm.nearest(center)

  if (!nearest.name || !nearest.location.length) {
    return randomize(undefined, ++count)
  }

  const {
    location: [lon, lat],
  } = nearest

  return {
    ...center,
    lat,
    lon,
  }
}

module.exports = {
  randomize,
}
