import io from 'socket.io-client'
import { routeApi } from '../config'

let congrats = 0

export const newSocket = () => {
  const socket = io(routeApi)

  socket.on('congrats', () => ++congrats)

  return socket
}

export const confirmed = () => {
  return congrats
}

export default newSocket
