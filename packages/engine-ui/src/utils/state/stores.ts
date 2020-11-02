import create from 'zustand'
import * as reducers from './reducers'
import * as types from './types'
import { FlyToInterpolator } from 'react-map-gl'

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

export { ui, map }
