export interface LocationMessage {
  id: string
  location: {
    lat: number
    lon: number
  }
}

export interface Address {
  lat: string
  lon: string
  name?: string
  street?: string
  city?: string
}

export interface Instruction {
  address: Address
  index: number
  type: string
  id: string
}

export interface Vehicle {
  activities?: Instruction[]
  booking_ids: string[]
  telegramId?: string
  id: string
}

export interface Booking {
  pickup: Address
  delivery: Address
  external_id: string
  size: {
    weight?: number
    measurement?: number[]
  }
  id: string
  metadata: {
    cargo?: string
    recipient?: {
      contact?: string
      info?: string
    }
    sender?: {
      info?: string
      contact?: string
    }
    fragile?: boolean
  }
}
