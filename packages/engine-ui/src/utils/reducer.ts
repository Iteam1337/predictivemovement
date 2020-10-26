import { getColor } from './palette'
import * as types from '../types'

export const reducer = (state: State, action: any) => {
  switch (action.type) {
    case 'setTransports':
      return {
        ...state,
        vehicles: [
          ...state.vehicles.filter(
            (c) => !action.payload.find((p: any) => p.id === c.id)
          ),
          ...action.payload,
        ].map((v, i) => ({ ...v, color: getColor(i, 0) })),
      }
    case 'updateTransport': {
      const { id, ...rest } = action.payload

      return {
        ...state,
        vehicles: [
          ...state.vehicles.map((t) => {
            if (t.id !== id) {
              return t
            }

            return {
              ...t,
              ...rest,
            }
          }),
        ],
      }
    }
    case 'deleteVehicle':
      return {
        ...state,
        vehicles: state.vehicles.filter((c) => c.id !== action.payload),
      }
    case 'deleteBooking':
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.payload
        ),
      }
    case 'setBookings':
      return {
        ...state,
        bookings: [
          ...state.bookings.filter(
            (b) => !action.payload.find((p: any) => p.id === b.id)
          ),
          ...action.payload,
        ],
      }

    case 'setPlan':
      return {
        ...state,
        plan: action.payload,
      }

    case 'clearState':
      return initState

    default:
      return state
  }
}

type State = {
  bookings: types.Booking[]
  assignedBookings: types.Booking[]
  vehicles: types.Transport[]
  plan: any[]
}

export const initState: State = {
  bookings: [],
  assignedBookings: [],
  vehicles: [],
  plan: [],
}
