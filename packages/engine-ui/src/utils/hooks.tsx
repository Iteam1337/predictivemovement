import React, { SetStateAction } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { FormState as CreateTransportState } from '../components/CreateTransport'
import * as helpers from './helpers'
import * as stores from './state/stores'
import { useSocket } from 'use-socketio'
import { FormBooking } from '../components/EditBooking/EditBooking'
import * as mapUtils from '../utils/mapUtils'
import * as types from '../types'

export const useFilteredStateFromQueryParams = (
  state: types.state.DataState
) => {
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

  const planView = useRouteMatch<{ id: string }>({
    path: ['/plans'],
  })

  const planRouteDetailsView = useRouteMatch<{ routeId: string }>({
    path: '/plans/routes/:routeId',
    exact: true,
  })

  const includeBookingRouteIfDetailView = (booking: types.Booking) => {
    if (bookingDetailView) {
      return booking
    }

    const { route, ...rest } = booking

    return rest
  }

  const includeOneBookingIfDetailView = (
    booking: types.Booking | Omit<types.Booking, 'route'>
  ) => (bookingDetailView ? bookingDetailView.params.id === booking.id : true)

  const includeTransportRouteIfDetailView = (transport: types.Transport) => {
    if (transportDetailView) {
      return transport
    }
    const { currentRoute, ...rest } = transport

    return rest
  }

  const includeOneTransportIfDetailView = (
    transport: types.Transport | Omit<types.Transport, 'currentRoute'>
  ) =>
    transportDetailView ? transportDetailView.params.id === transport.id : true

  const includeOnePlanRouteIfDetailView = (route: types.Route) => {
    if (transportDetailView) {
      return transportDetailView.params.id === route.id
    }
    if (planRouteDetailsView) {
      return planRouteDetailsView.params.routeId === route.id
    }
    return true
  }

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
      plan:
        (transportDetailView &&
          state.plan.routes.find(
            (route) => route.id === transportDetailView.params.id
          )) ||
        planView
          ? {
              excludedBookings: state.plan.excludedBookings,
              routes: state.plan.routes
                .map((r: types.Route, i: number) => ({ ...r, routeIndex: i }))
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
            properties: { name, label },
          }: {
            geometry: {
              coordinates: [lat: number, lon: number]
            }
            properties: { name: string; label: string }
          }) => {
            const address = label.split(',')
            const county = address[address.length - 2].trim()
            return {
              name,
              county,
              lon,
              lat,
              displayName: `${name}, ${county}`,
            }
          }
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
  const [suggested] = React.useState(initialState)

  const find = (query: string) => {
    socket.emit('search-parcel', query)
  }

  return [find, suggested]
}

export const useFormStateWithMapClickControl = <
  T extends CreateTransportState | FormBooking
>(
  start: string,
  end: string,
  set: (callback: SetStateAction<T>) => void
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

export const useMapLayers = (
  state: types.state.DataState,
  mapState: types.state.MapLayerState,
  UIState: types.state.UIState,
  handleClick: (event: any) => void,
  showTextLayer: boolean
) =>
  React.useMemo(
    () => [
      mapUtils.toGeoJsonLayer(
        'geojson-bookings-layer',
        mapUtils.bookingToFeature(mapState.bookings),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-plan-layer',
        mapUtils.planToFeature(mapState.plan.routes, state.transports),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-transport-layer',
        mapUtils.planToFeature(mapState.transports),
        handleClick
      ),
      ...mapState.plan.routes
        .map((route) =>
          mapUtils.toBookingIconLayer(
            route.activities?.slice(1, -1),
            'address',
            UIState.highlightBooking,
            { offset: [40, 0] }
          )
        )
        .concat(
          mapState.plan.excludedBookings.map((b) =>
            mapUtils.toExcludedBookingIcon(b, UIState.highlightBooking)
          )
        ),
      mapUtils.toTransportIconLayer(
        mapState.transports,
        UIState.highlightTransport
      ),
      mapUtils.toIconClusterLayer({
        type: 'bookings',
        data: mapState.bookings.flatMap(({ id, pickup }) => ({
          coordinates: [pickup.lon, pickup.lat],
          active: id === UIState.highlightBooking,
        })),
        properties: {},
      }),
      mapUtils.toTextLayer(
        mapUtils.routeActivitiesToFeature(showTextLayer && mapState.plan.routes)
      ),
    ],
    [
      UIState.highlightBooking,
      UIState.highlightTransport,
      handleClick,
      mapState.bookings,
      mapState.plan.excludedBookings,
      mapState.plan.routes,
      mapState.transports,
      showTextLayer,
      state.transports,
    ]
  )
