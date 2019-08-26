type Longitude = number
type Latitude = number

export type Coordinate = [Longitude, Latitude]

export type Code =
  | 'Ok'
  | 'InvalidUrl'
  | 'InvalidService'
  | 'InvalidVersion'
  | 'InvalidOptions'
  | 'InvalidQuery'
  | 'InvalidValue'
  | 'NoSegment'
  | 'TooBig'

export type Waypoint = {
  hint: string
  distance: number
  name: string
  /**
   * [Longitude, Latitude]
   */
  location: Coordinate
}

export type Response = {
  code: Code
  /**
   * Only displayed if errnonus
   */
  message?: string
}

export type Nearest = Response & {
  waypoints: Waypoint[]
}
