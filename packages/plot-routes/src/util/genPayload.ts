import { Position } from 'Position'
import { destination } from '../config'

export const genPayload = (startPosition: Position) => {
  const date = new Date().toISOString().split('T')[0]

  return {
    start: {
      date,
      position: startPosition,
    },
    end: {
      date,
      position: destination,
    },
  }
}

export default genPayload
