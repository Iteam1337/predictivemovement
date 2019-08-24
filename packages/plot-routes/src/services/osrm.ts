import { Position } from 'Position'
import { Nearest } from 'OSRM'
import osrm from '../adapters/osrm'

const latLon = ({ lat, lon }: Position) => `${lon},${lat}`

export const nearest = async (position: Position) => {
  const { data }: { data: Nearest } = await osrm.get(`/nearest/v1/driving/${latLon(position)}`)

  return data
}

export default {
  nearest,
}
