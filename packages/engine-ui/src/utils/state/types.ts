import { FlyToInterpolator } from 'react-map-gl'
import { getLineAndCharacterOfPosition } from 'typescript'
import { Booking, Transport, Plan } from '../../types'

export enum lastFocusedInput {
  START = 'start',
  END = 'end',
}

export type UIState = {
  showMapTooltip: boolean
  highlightBooking?: string
  highlightTransport?: string
  lastFocusedInput?: lastFocusedInput
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
} & { dispatch: (action: UIStateReducerAction) => void }

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

export type MapState = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration: number
  transitionInterpolator: FlyToInterpolator
  transitionEasing: (t: number) => number
} & { set: (args: Partial<MapState>) => void }

export type DataState = {
  bookings: Booking[]
  transports: Transport[]
  plan: Plan
} & { set: (args: Partial<DataState>) => void }

export type MapLayerStateReducerAction =
  | {
      type: 'bookingIcons'
    }
  | {
      type: 'transportIcons'
    }
  | { type: 'bookingDetails'; payload: { bookingId: string } }
  | { type: 'transportDetails'; payload: { transportId: string } }

export type MapLayerState = {
  bookings: Booking[]
  transports: Transport[]
  plan: Plan
} & {
  set: (action: MapLayerStateReducerAction) => void
}
