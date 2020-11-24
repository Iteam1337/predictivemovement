import React, { SetStateAction } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { FormState } from '../components/CreateTransport'
import { Booking, Route, Transport } from '../types'
import * as helpers from './helpers'
import { State } from './reducer'
import * as stores from './state/stores'
import { useSocket } from 'use-socketio'

export const useFilteredStateFromQueryParams = (state: State) => {
  const includeBookings = useRouteMatch({
    path: ['/bookings', '/bookings/:id'],
    exact: true,
  })

  const includeTransports = useRouteMatch({
    path: ['/plans', '/transports', '/transports/:id'],
    exact: true,
  })

  const rootView = useRouteMatch({
    path: '/',
    exact: true,
  })

  const bookingDetailView = useRouteMatch<{ id: string }>({
    path: '/bookings/:id',
    exact: true,
  })

  const transportDetailView = useRouteMatch<{ id: string }>({
    path: '/transports/:id',
    exact: true,
  })

  const planView = useRouteMatch({
    path: '/plans',
  })

  const planRouteDetailsView = useRouteMatch<{ routeId: string }>({
    path: '/plans/routes/:routeId',
    exact: true,
  })

  const includeBookingRouteIfDetailView = (booking: Booking) => {
    if (bookingDetailView) {
      return booking
    }

    const { route, ...rest } = booking

    return rest
  }

  const includeOneBookingIfDetailView = (
    booking: Booking | Omit<Booking, 'route'>
  ) => (bookingDetailView ? bookingDetailView.params.id === booking.id : true)

  const includeTransportRouteIfDetailView = (transport: Transport) => {
    if (transportDetailView) {
      return transport
    }
    const { current_route, ...rest } = transport

    return rest
  }
  const includeOneTransportIfDetailView = (
    transport: Transport | Omit<Transport, 'current_route'>
  ) =>
    transportDetailView ? transportDetailView.params.id === transport.id : true

  const includeOnePlanRouteIfDetailView = (route: Route) =>
    planRouteDetailsView
      ? planRouteDetailsView.params.routeId === route.id
      : true

  return {
    data: {
      ...state,
      bookings:
        includeBookings || rootView
          ? state.bookings
              .map(includeBookingRouteIfDetailView)
              .filter(includeOneBookingIfDetailView)
          : [],
      transports:
        includeTransports || rootView
          ? state.transports
              .map(includeTransportRouteIfDetailView)
              .filter(includeOneTransportIfDetailView)
          : [],
      plan: planView
        ? {
            excludedBookings: state.plan.excludedBookings,
            routes: state.plan.routes
              .map((r: Route, i: number) => ({ ...r, routeIndex: i }))
              .filter(includeOnePlanRouteIfDetailView),
          }
        : { excludedBookings: [], routes: [] },
    },
  }
}

export const useGetSuggestedAddresses = (initialState = []) => {
  const [suggested, set] = React.useState(initialState)
  const find = (query: string, callback: () => void) =>
    helpers
      .findAddress(query)
      .then(({ features }) => {
        const parsedFeatures = features.map(
          ({
            geometry: {
              coordinates: [lon, lat],
            },
            properties: { name, county },
          }: {
            geometry: {
              coordinates: [lat: number, lon: number]
            }
            properties: { name: string; county: string }
          }) => ({
            name,
            county,
            lon,
            lat,
            displayName: `${name}, ${county}`,
          })
        )
        set(parsedFeatures.length > 0 ? parsedFeatures : initialState)

        return callback()
      })
      .catch((error) =>
        console.log(
          'something went wrong with getting suggested addresses: ',
          error
        )
      )

  return [find, suggested]
}

export const useGetParcelInfo = (initialState = []) => {
  const { socket } = useSocket()
  const [suggested, set] = React.useState(initialState)
  const find = (query: string, callback: () => void) => {
    socket.emit('search-parcel', query)
  }

  return [find, suggested]
}

export const useFormStateWithMapClickControl = (
  start: string,
  end: string,
  set: (callback: SetStateAction<FormState>) => void
) => {
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  React.useEffect(() => {
    /**
     * Listen for a combination of clicks on an
     * input field and on the map.
     * When this happens, set pickup/delivery input
     * to name of address clicked on map.
     */

    if (UIState.lastFocusedInput && UIState.lastClickedPosition.address) {
      const { address, lat, lon } = UIState.lastClickedPosition
      const formattedAddress = `${address.name}, ${address.county}`

      switch (UIState.lastFocusedInput) {
        case 'start':
          set((current) => ({
            ...current,
            [start]: {
              ...current[start],
              name: formattedAddress,
              street: address.name,
              city: address.county,
              lat,
              lon,
            },
          }))
          break

        case 'end':
          set((current) => ({
            ...current,
            [end]: {
              ...current[end],
              name: formattedAddress,
              street: address.name,
              city: address.county,
              lat,
              lon,
            },
          }))
          break

        default:
          break
      }

      return setUIState({ type: 'resetInputClickState' })
    }
  }, [
    setUIState,
    UIState.lastClickedPosition,
    UIState.lastFocusedInput,
    set,
    start,
    end,
  ])

  React.useEffect(() => {
    return () => setUIState({ type: 'resetInputClickState' })
  }, [setUIState])
}
