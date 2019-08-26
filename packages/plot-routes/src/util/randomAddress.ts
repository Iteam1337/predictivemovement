import { Position } from 'Position'
import osrm from '../services/osrm'
import { destination, radiusInKm } from '../config'

export let lonMin: number
export let lonMax: number
export let latMin: number
export let latMax: number

export const setDefaults = (center = destination) => {
  const radius = radiusInKm * 0.621371192
  const world = Math.abs(Math.cos((center.lat * Math.PI) / 180) * 69)

  lonMin = center.lon - radius / world
  lonMax = center.lon + radius / world
  latMin = center.lat - radius / 69
  latMax = center.lat + radius / 69
}

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
