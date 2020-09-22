export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
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

export type Vehicle = {
  id: string
}

export type NotificationType = Vehicle | Booking
