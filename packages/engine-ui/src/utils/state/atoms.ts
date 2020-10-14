import { FlyToInterpolator } from 'react-map-gl'
import { atom } from 'recoil'
import * as types from './types'

const map = atom<types.MapState>({
  key: 'viewState',
  default: {
    latitude: 61.8294959,
    longitude: 16.0740589,
    zoom: 10,
    transitionDuration: 3000,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: (t: number) => t * (2 - t),
  },
})

const ui = atom<types.UIState>({
  key: 'ui',
  default: {
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
  },
})

export default { map, ui }
