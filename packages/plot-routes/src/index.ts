import Position from 'Position'
import { count, destination, radiusInKm } from './config'
import randomize from './util/randomAddress'
import { newRoute, newPickup } from './services/routeApi'
import { confirmed } from './adapters/socket'

const main = async () => {
  const points: Position[] = []
  const sockets: SocketIOClient.Socket[] = []
  const waypoints: Position[] = []

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

  generateGoogleURL(waypoints)
}

const generateGoogleURL = (waypoints: Position[]) => {
  const origin = waypoints.shift()

  if (!origin) {
    return
  }

  waypoints.push(destination)

  let url = `https://www.google.com/maps/dir/?api=1`
  url += `&origin=${origin.lat},${origin.lon}&waypoints=`
  url += waypoints.map(({ lat, lon }) => `${lat},${lon}`).join('|')

  console.log(url)
}

console.info(`
destination = ${JSON.stringify(destination, null, 2)}
radius in km = ${radiusInKm}
maximum generated positions = ${count}`)

main()
