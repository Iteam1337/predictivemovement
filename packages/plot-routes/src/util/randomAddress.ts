import { Position } from 'Position'
import osrm from '../services/osrm'
import { destination, radiusInKm } from '../config'

export const { lonMin, lonMax, latMin, latMax } = (() => {
  const radius = radiusInKm * 0.621371192
  const world = Math.abs(Math.cos((destination.lat * Math.PI) / 180) * 69)

  const lonMin = destination.lon - radius / world
  const lonMax = destination.lon + radius / world
  const latMin = destination.lat - radius / 69
  const latMax = destination.lat + radius / 69

  return { lonMin, lonMax, latMin, latMax }
})()

export const genRandomPoint = () => ({
  lat: Math.random() * (latMax - latMin) + latMin,
  lon: Math.random() * (lonMax - lonMin) + lonMin
})

export const randomize = async (count = 0): Promise<Position> => {
  const center = genRandomPoint()

  if (count > 250) {
    throw new Error('limit reached')
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

  return { lat, lon }
}

export default randomize
