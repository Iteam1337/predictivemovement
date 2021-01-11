import * as types from '../../../types/state'

const reducer = (
  initialState: types.MapLayerState,
  state: types.DataState,
  action: types.MapLayerStateReducerAction
) => {
  switch (action.type) {
    case 'bookingIcons':
      return Object.assign({}, initialState, {
        bookings: state.bookings.map((booking) => {
          const { route, ...rest } = booking
          return rest
        }),
      })

    case 'bookingDetails':
      return Object.assign({}, initialState, {
        bookings: state.bookings.filter(
          (booking) => booking.id === action.payload.bookingId
        ),
      })

    case 'transportDetails':
      return Object.assign({}, initialState, {
        transports: state.transports.filter(
          (transport) => transport.id === action.payload.transportId
        ),
      })

    case 'transportIcons':
      return { ...initialState, transports: state.transports }

    case 'plan':
      return { ...initialState, plan: state.plan }
    default:
      return initialState
  }
}

export default reducer
