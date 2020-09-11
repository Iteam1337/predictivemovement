export const reducer = (state, action) => {
  switch (action.type) {
    case 'setCars':
      return {
        ...state,
        cars: [
          ...state.cars.filter(
            (c) => !action.payload.find((p) => p.id === c.id)
          ),
          ...action.payload,
        ],
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
  carBookingLineCollection: [],
  bookings: [],
  assignedBookings: [],
  cars: [],
  plan: [],
}
