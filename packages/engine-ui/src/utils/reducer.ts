import { getColor } from './palette'
import * as stateTypes from './state/types'

export const reducer = (state: stateTypes.State, action: any) => {
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

export const initState: stateTypes.State = {
  bookings: [],
  assignedBookings: [],
  vehicles: [],
  plan: {
    excludedBookings: [],
    routes: [],
  },
}
