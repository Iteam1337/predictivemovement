import { FlyToInterpolator } from 'react-map-gl'
import { Booking, Transport, Plan, Signature } from './'
import * as notificationTypes from '../types/notification'

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

export type CurrentLocation = {
  lat: number | undefined
  lon: number | undefined
  name: string
  county: string
} & { set: (args: Partial<CurrentLocation>) => void }

export type MapLayerStateReducerAction =
  | {
      type: 'bookingIcons'
    }
  | {
      type: 'plan'
    }
  | {
      type: 'transportIcons'
    }
  | { type: 'bookingDetails'; payload: { bookingId: string } }
  | { type: 'transportDetails'; payload: { transportId: string } }
  | { type: 'planRouteDetails'; payload: { routeId: string } }

export type DataStateReducerAction =
  | {
      type: 'setTransports'
      payload: Transport[]
    }
  | {
      type: 'updateTransport'
      payload: Transport
    }
  | {
      type: 'deleteTransport'
      payload: Transport['id']
    }
  | {
      type: 'deleteBooking'
      payload: Booking['id']
    }
  | {
      type: 'setBookings'
      payload: Booking[]
    }
  | {
      type: 'setPlan'
      payload: Plan
    }
  | { type: 'setSignatures'; payload: Signature[] }
  | { type: 'clearState' }

export type DataState = {
  bookings: Booking[]
  transports: Transport[]
  assignedBookings: Booking[]
  plan: Plan
  signatures: Signature[]
}

export type MapLayerState = {
  bookings: Booking[]
  transports: Transport[]
  plan: Plan
}

export type DataStateWithSet = DataState & {
  set: (action: DataStateReducerAction) => void
}

export type MapLayerStateWithSet = MapLayerState & {
  set: (action: MapLayerStateReducerAction) => void
}

export type NotificationsWithSet = {
  notifications: notificationTypes.Notification[]
} & {
  addOne: (notification: notificationTypes.Notification) => void
  deleteOneById: (id: string) => void
}
