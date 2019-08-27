import Position from 'Position'
import {
  count as defaultCount,
  destination as defaultDestination,
  radiusInKm as defaultRadiusInKm,
} from '../config'
import randomize, { setDefaults } from '../util/randomAddress'
import { newRoute, newPickup } from './routeApi'
import { confirmed } from '../adapters/socket'

export const genRequests = async (
  {
    destination = defaultDestination,
    count = defaultCount,
    radiusInKm = defaultRadiusInKm,
  }: { destination?: Position; count?: number; radiusInKm?: number } = {
    destination: defaultDestination,
    count: defaultCount,
    radiusInKm: defaultRadiusInKm,
  }
): Promise<Position[]> => {
  setDefaults(destination, radiusInKm)

  const points: Position[] = []
  const sockets: SocketIOClient.Socket[] = []
  const waypoints: Position[] = []

  console.info(`
destination = ${JSON.stringify(destination, null, 2)}
radius in km = ${radiusInKm}
maximum generated positions = ${count}`)

  for (let i = 0; i < count; i++) {
    let random: Position
    try {
      random = await randomize()
      points.push(random)
    } catch (_) {
      //
    }
  }

  console.info(`generated positions = ${points.length}\n`)

  for (const point of points) {
    const isDriver = Math.random() > 0.7
    const label = isDriver ? 'driver' : 'passenger'
    try {
      sockets.push(
        await (isDriver
          ? newRoute(point, destination)
          : newPickup(point, destination))
      )
      console.log(`added ${label}`)
      waypoints.push(point)
    } catch (_) {
      console.log(`failed to add ${label}`)
    }
  }

  console.info(`
handled requests = ${sockets.length}\ncongrats sent = ${confirmed()}`)

  await Promise.all(
    sockets.map(socket => (socket && socket.close ? socket.close() : null))
  )

  return waypoints
}

export default genRequests
