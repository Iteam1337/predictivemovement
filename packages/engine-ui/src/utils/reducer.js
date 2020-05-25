export const reducer = (state, action) => {
  switch (action.type) {
    case 'setCars':
      return {
        ...state,
        cars: action.payload,
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
    default:
      return state
  }
}

export const initState = {
  carBookingLineCollection: [],
  bookings: [],
  assignedBookings: [],
  cars: [],
}
