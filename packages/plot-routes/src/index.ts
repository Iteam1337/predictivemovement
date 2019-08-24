import Position from 'Position'
import { count, destination, radiusInKm } from './config'
import randomize from './util/randomAddress'
import { newRoute, newPickup } from './services/routeApi'
import * as socket from './adapters/socket'

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

  for (const point of points) {
    const isDriver = Math.random() > 0.7
    const label = isDriver ? 'driver' : 'passenger'
    try {
      sockets.push(isDriver ? await newPickup(point) : await newRoute(point))
      console.log(`added ${label}`)
    } catch (_) {
      console.log(`failed to add ${label}`)
    }
  }

  const missing =
    sockets.length === points.length ? '' : ` (${points.length} possible)`

  console.info(
    `handled ${
      sockets.length
    } requests${missing}\n${socket.confirmed()} congrats sent`
  )

  await Promise.all(
    sockets.map(socket => (socket && socket.close ? socket.close() : null))
  )
}

console.info(`
starting with destination: ${JSON.stringify(destination)}
with a radius of: ${radiusInKm}km
using max-trips: ${count}
`)

main()
