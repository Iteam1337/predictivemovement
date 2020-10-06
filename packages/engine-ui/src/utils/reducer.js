import { getColor } from './palette'

export const reducer = (state, action) => {
  switch (action.type) {
    case 'setTransports':
      return {
        ...state,
        vehicles: [
          ...state.vehicles.filter(
            (c) => !action.payload.find((p) => p.id === c.id)
          ),
          ...action.payload,
        ].map((v, i) => ({ ...v, color: getColor(i, 0) })),
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
            (b) => !action.payload.find((p) => p.id === b.id)
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

export const initState = {
  bookings: [],
  assignedBookings: [],
  vehicles: [],
  plan: [],
}
