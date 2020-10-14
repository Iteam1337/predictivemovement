import { FlyToInterpolator } from 'react-map-gl'

export type MapState = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration: number
  transitionInterpolator: FlyToInterpolator
  transitionEasing: (t: number) => number
}

export type UIState = {
  showMapTooltip: boolean
  highlightBooking?: string
  highlightTransport?: string
  lastFocusedInput?: 'start' | 'end'
  lastClickedPosition: {
    x?: number
    y?: number
    lat?: number
    lon?: number
    address?: {
      name: string
      county: string
    }
  }
}

export type UIStateReducerAction =
  | { type: 'focusInput'; payload: UIState['lastFocusedInput'] }
  | { type: 'hideTooltip' }
  | { type: 'resetInputClickState' }
  | { type: 'lastClickedPosition'; payload: UIState['lastClickedPosition'] }
  | { type: 'highlightBooking'; payload: UIState['highlightBooking'] }
  | { type: 'highlightTransport'; payload: UIState['highlightTransport'] }
  | { type: 'showMapTooltip'; payload: UIState['showMapTooltip'] }
  | {
      type: 'addAddressToLastClickedPosition'
      payload: UIState['lastClickedPosition']['address']
    }
