export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export enum TransportTypes {
  TRUCK = 'truck',
}

export type Truck = {
  capacity: { weight: number; volume: number }
}

interface BookingRoute {
  distance: number
  duration: number
  geometry: {
    coordinates: {
      lat: number
      lon: number
    }[]
    legs: any[]
    weight: number
    weight_name: string
  }
}

export interface Booking {
  id: string
  pickup: ParcelAddress
  delivery: ParcelAddress
  metadata: Metadata
  route: BookingRoute
  size: Size
  status: BookingStatus
}

type ParcelAddress = {
  lat: number
  lon: number
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

export type InAppColor = string

export type Transport = {
  id: string
  name?: string
  activities: Activity[] | null
  busy: any
  metadata: { profile?: string }
  booking_ids: string[] | null
  current_route: any
  earliest_start: Date
  latest_end: Date
  capacity?: { weight?: number; volume?: number }
  end_address: Address
  profile: any
  start_address: Address
  color: InAppColor
}

export type NotificationType = Transport | Booking

export interface ExcludedBooking {
  status: string
  id: string
  lat: number
  lon: number
}

export interface Plan {
  excludedBookings: ExcludedBooking[]
  routes: Route[]
}

export interface Route {
  activities: Activity[] | null
  booking_ids: string[] | null
  busy: any
  capacity?: { weight?: number; volume?: number }
  current_route: any
  earliest_start: Date
  id: string
  latest_end: Date
  metadata: any
  profile: any
  start_address: Address
  end_address: Address
}

export interface Address {
  lat: number
  lon: number
  name?: string
}

export interface Activity {
  address: Address
  index: number
  type: string
  id: string
}
