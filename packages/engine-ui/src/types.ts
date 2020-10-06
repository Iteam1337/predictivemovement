export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export interface Booking {
  id: string
  pickup: ParcelAddress
  delivery: ParcelAddress
  metadata: Metadata
  size: Size
  status: BookingStatus
}

type ParcelAddress = {
  lat: string
  lon: string
  street: string
  city: string
  time_windows: TimeWindow[] | null
}

type Size = {
  weight?: number
  measurement?: number[]
}

type Metadata = {
  cargo?: string
  fragile: boolean
  sender: { name?: string; contact: string }
  recipient: { name?: string; contact: string }
}

type TimeWindow = {
  earliest: string
  latest: string
}

export type Vehicle = {
  id: string
  booking_ids: [] | null
}

export type NotificationType = Vehicle | Booking

export interface PlanVehicle {
  activities: Activity[]
  booking_ids: string[]
  busy: any
  capacity: any
  current_route: any
  earliest_start: Date
  end_address: AddressWithName
  id: string
  latest_end: Date
  metadata: any
  profile: any
  start_address: AddressWithName
}

interface Address {
  lat: string
  lon: string
}

interface Activity {
  address: Address
  index: number
  type: string
}

interface AddressWithName extends Address {
  name: string
}
