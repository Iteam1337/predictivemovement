import create from 'zustand'
import * as reducers from './reducers'
import * as types from './types'
import { FlyToInterpolator } from 'react-map-gl'
import { Switch } from '@material-ui/core'

const ui = create<types.UIState>(
  (set): types.UIState => ({
    showMapTooltip: false,
    highlightBooking: undefined,
    highlightTransport: undefined,
    lastClickedPosition: {
      x: undefined,
      y: undefined,
      lat: undefined,
      lon: undefined,
      address: undefined,
    },
    lastFocusedInput: undefined,
    dispatch: (action) => set((state) => reducers.ui(state, action)),
  })
)

const map = create<types.MapState>(
  (set, get): types.MapState => ({
    latitude: 61.8294959,
    longitude: 16.0740589,
    zoom: 10,
    transitionDuration: 3000,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: (t: number) => t * (2 - t),
    set: (data) => set({ ...get(), ...data }),
  })
)

const initialDataState = {
  bookings: [],
  transports: [],
  plan: { excludedBookings: [], routes: [] },
}

const dataState = create<types.DataState>(
  (set, get): types.DataState => ({
    ...initialDataState,
    set: (data) => set({ ...get(), ...data }),
  })
)

const mapLayerReducer = (
  initialState: any,
  state: any,
  action: types.MapLayerStateReducerAction
) => {
  switch (action.type) {
    case 'bookingIcons':
      return Object.assign({}, initialState, {
        bookings: state.bookings.map((booking: any) => {
          const { route, ...rest } = booking
          return rest
        }),
      })

    case 'bookingDetails':
      return Object.assign({}, initialState, {
        bookings: state.bookings.filter(
          (booking: any) => booking.id === action.payload.bookingId
        ),
      })

    case 'transportDetails':
      return Object.assign({}, initialState, {
        transports: state.transports.filter(
          (transport: any) => transport.id === action.payload.transportId
        ),
      })

    case 'transportIcons':
      return { ...initialState, transports: state.transports }

    // case 'plan':
    //   return { ...initialState, plan: state.plan }
    default:
      return initialState
  }
}

// const mapLayerState = create<types.MapLayerState>(
//   (set, get): types.MapLayerState => ({
//     layers: [],
// set: (action) =>
//   set((state) => mapLayerReducer(dataState.getState(), state, action)),
//   })
// )

const mapLayerState = create<types.MapLayerState>(
  (set): types.MapLayerState => ({
    ...initialDataState,
    set: (action) =>
      set(() =>
        mapLayerReducer(initialDataState, dataState.getState(), action)
      ),
  })
)

export { ui, map, dataState, mapLayerState }
