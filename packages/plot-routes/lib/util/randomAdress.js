const osrm = require('../services/osrm')
const { destination, radiusInKm } = require('../config')

const { lonMin, lonMax, latMin, latMax } = (() => {
  const radius = radiusInKm * 0.621371192
  const space = Math.abs(Math.cos((destination.lat * Math.PI) / 180) * 69)

  const lonMin = destination.lon - radius / space
  const lonMax = destination.lon + radius / space
  const latMin = destination.lat - radius / 69
  const latMax = destination.lat + radius / 69

  return { lonMin, lonMax, latMin, latMax }
})()

const genRandomPoint = () => ({
  lat: Math.random() * (latMax - latMin + 1) + latMin,
  lon: Math.random() * (lonMax - lonMin + 1) + lonMin,
})

const randomize = async (count = 0) => {
  const center = genRandomPoint()

  if (count > 250) {
    throw new Error(`Randomize in loop try nr ${count}`)
  }

  const {
    waypoints: [nearest],
  } = await osrm.nearest(center)

  if (!nearest.name || !nearest.location.length) {
    return randomize(++count)
  }

  const {
    location: [lon, lat],
  } = nearest

  return { ...center, lat, lon }
}

module.exports = {
  genRandomPoint,
  randomize,
}
