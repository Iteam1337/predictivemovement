import { FlyToInterpolator } from 'react-map-gl'
import * as baseTypes from '../../types'

export enum lastFocusedInput {
  START = 'start',
  END = 'end',
}

export type State = {
  bookings: baseTypes.Booking[]
  assignedBookings: baseTypes.Booking[]
  vehicles: baseTypes.Transport[]
  plan: baseTypes.Plan
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

export type MapViewState = {
  latitude: number
  longitude: number
  zoom: number
  transitionDuration: number
  transitionInterpolator: FlyToInterpolator
  transitionEasing: (t: number) => number
} & { set: (args: Partial<MapViewState>) => void }

export type MapFilters = {
  bookings: boolean
  bookingDetailsById: string | undefined
  transportDetailsById: string | undefined
  planRouteDetailsById: string | undefined
  transports: boolean
  plan: boolean
  excludedBookings: boolean
  routes: boolean
}

export type MapFiltersWithSetter = MapFilters & {
  set: (args: Partial<MapFilters>) => void
}

export type MapDataFilterFunctions = {
  [key in keyof MapFilters]: (param: MapDataState) => MapDataState
}

export type MapDataStateWithSetter = MapDataState & {
  set: (args: Partial<MapDataState>) => void
}

export type MapDataState = {
  bookings: State['bookings']
  transports: State['vehicles']
  plan: {
    excludedBookings: State['plan']['excludedBookings']
    routes: (baseTypes.Route & { routeIndex: number })[]
  }
}
