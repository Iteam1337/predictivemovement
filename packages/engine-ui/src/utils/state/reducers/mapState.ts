import * as types from '../../../types/state'

const reducer = (
  initialState: types.MapLayerState,
  state: types.DataState,
  action: types.MapLayerStateReducerAction
): types.MapLayerState => {
  switch (action.type) {
    case 'bookingIcons':
      return Object.assign({}, initialState, {
        bookings: state.bookings.map((booking) => {
          return { ...booking, route: undefined }
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
        plan: Object.assign({}, initialState.plan, {
          routes: state.plan.routes.filter(
            (route) => route.id === action.payload.transportId
          ),
        }),
      })

    case 'planRouteDetails':
      return Object.assign({}, initialState, {
        plan: Object.assign({}, initialState.plan, {
          routes: state.plan.routes.filter(
            (route) => route.id === action.payload.routeId
          ),
        }),
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
