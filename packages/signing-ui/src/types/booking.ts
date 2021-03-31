export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export interface Booking {
  id: string
  externalId?: string
  pickup: ParcelAddress
  delivery: ParcelAddress
  metadata: Metadata
  route: BookingRoute
  size: Size
  status: BookingStatus
}

type ParcelAddress = {
  name?: string
  lat: number
  lon: number
  street: string
  city: string
  timeWindows: TimeWindow[] | null
}

type Size = {
  weight?: number
  measurements?: number[]
}

type Metadata = {
  cargo?: string
  fragile: boolean
  sender: { name?: string; contact: string }
  recipient: { name?: string; contact: string }
}

type TimeWindow = {
  earliest: string | Date
  latest: string | Date
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
