import { Position } from 'Position'
import { destination as defaultDestination } from '../config'

export const genPayload = (
  startPosition: Position,
  destination: Position = defaultDestination
) => {
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
