export const reducer = (state, action) => {
  switch (action.type) {
    case 'setCars':
      return {
        ...state,
        cars: action.payload,
      }
    case 'setCarBookingLines':
      return {
        ...state,
        carBookingLineCollection: action.payload,
      }
    case 'setBookings':
      return {
        ...state,
        bookings: action.payload,
      }
    case 'removeBookings':
      const filtered = state.bookings.filter(
        (x) => !action.payload.some((i) => i.id === x.id)
      )

      return {
        ...state,
        bookings: filtered,
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
