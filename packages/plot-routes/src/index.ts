import Position from 'Position'
import { count, destination, radiusInKm } from './config'
import randomize from './util/randomAddress'
import { newRoute, newPickup } from './services/routeApi'
import { confirmed } from './adapters/socket'

const main = async () => {
  const points: Position[] = []
  const sockets: SocketIOClient.Socket[] = []

  for (let i = 0; i < count; i++) {
    let random
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
    } catch (_) {
      console.log(`failed to add ${label}`)
    }
  }

  console.info(`
handled requests = ${sockets.length}\ncongrats sent = ${confirmed()}`)

  await Promise.all(
    sockets.map(socket => (socket && socket.close ? socket.close() : null))
  )
}

console.info(`
destination = ${JSON.stringify(destination, null, 2)}
https://www.google.com/maps/place/${destination.lat},${destination.lon}
radius in km = ${radiusInKm}
maximum generated positions = ${count}`)

main()
