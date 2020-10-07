export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export type Booking = {
  id: string
  pickup: {
    lat: string
    lon: string
  }
  delivery: {
    lat: string
    lon: string
  }
  status: BookingStatus
}

export type InAppColor = string

export type Transport = {
  id: string
  name?: string
  activities: Activity[] | null
  metadata: { profile?: string }
  booking_ids: string[] | null
  earliest_start: Date
  latest_end: Date
  capacity?: { weight?: number; volume?: number }
  end_address: Address
  start_address: Address
  color: InAppColor
}

export type NotificationType = Transport | Booking

export interface PlanVehicle {
  activities: Activity[]
  booking_ids: string[]
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

interface Activity {
  address: Address
  index: number
  type: string
  id: string
}
