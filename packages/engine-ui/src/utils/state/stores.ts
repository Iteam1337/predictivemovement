import { FlyToInterpolator } from 'react-map-gl'
import create from 'zustand'
import * as reducers from './reducers'
import * as types from '../../types/state'

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

const initialDataState: types.DataState = {
  bookings: [],
  transports: [],
  assignedBookings: [],
  plan: { excludedBookings: [], routes: [] },
  signatures: [],
}

const dataState = create<types.DataStateWithSet>(
  (set, get): types.DataStateWithSet => ({
    ...initialDataState,
    set: (action) => set(() => reducers.state(initialDataState, get(), action)),
  })
)

const mapLayerState = create<types.MapLayerStateWithSet>(
  (set): types.MapLayerStateWithSet => ({
    ...initialDataState,
    set: (action) =>
      set(() =>
        reducers.mapState(initialDataState, dataState.getState(), action)
      ),
  })
)

const notifications = create<types.NotificationsWithSet>(
  (set): types.NotificationsWithSet => ({
    notifications: [],
    addOne: (notification) =>
      set((state) => ({
        notifications: state.notifications.concat(notification),
      })),
    deleteOneById: (id) =>
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.event.id !== id
        ),
      })),
  })
)

export { ui, map, dataState, mapLayerState, notifications }
