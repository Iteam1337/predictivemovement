import { Position } from 'Position'
import genPayload from '../util/genPayload'
import sleep from '../util/sleep'
import routeApi from '../adapters/routeApi'
import { newSocket } from '../adapters/socket'

export const newPickup = async (
  startPosition: Position,
  destination?: Position
): Promise<SocketIOClient.Socket> => {
  const payload = genPayload(startPosition, destination)
  const socket = newSocket()

  return new Promise((resolve, reject) => {
    socket.on('connect', async () => {
      try {
        socket.emit(
          'event',
          JSON.stringify({
            payload,
            type: 'passenger',
          })
        )

        await sleep()

        resolve(socket)
      } catch (_) {
        reject(socket.close())
      }
    })

    socket.on('disconnect', () => reject(socket.close()))
  })
}

export const newRoute = async (
  startPosition: Position,
  destination?: Position
): Promise<SocketIOClient.Socket> => {
  const payload = genPayload(startPosition, destination)
  const socket = newSocket()

  return new Promise((resolve, reject) => {
    socket.on('connect', () =>
      socket.emit(
        'event',
        JSON.stringify({
          payload,
          type: 'driver',
        })
      )
    )

    socket.on('changeRequested', async (id: string) => {
      try {
        await routeApi.get(`/pending-route/${id}`) // check if route exists ...

        socket.emit(
          'event',
          JSON.stringify({
            payload: { id },
            type: 'acceptChange',
          })
        )

        await sleep(1000) // race condition!

        resolve(socket)
      } catch (_) {
        reject(socket.close())
      }
    })

    socket.on('congrats', () => resolve(socket))
    socket.on('disconnect', () => reject(socket.close()))
  })
}
