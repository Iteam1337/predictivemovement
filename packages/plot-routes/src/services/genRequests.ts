import Position from 'Position'
import { count, destination, radiusInKm } from '../config'
import randomize from '../util/randomAddress'
import { newRoute, newPickup } from './routeApi'
import { confirmed } from '../adapters/socket'

export const genRequests = async (): Promise<Position[]> => {
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
      sockets.push(await (isDriver ? newPickup(point) : newRoute(point)))
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
