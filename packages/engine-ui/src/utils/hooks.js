import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import helpers from './helpers'
import stores from '../utils/state/stores'

const useFilteredStateFromQueryParams = (state) => {
  const includeBookings = useRouteMatch(['/bookings', '/bookings/:id'], {
    exact: true,
  })

  const includeTransports = useRouteMatch(
    ['/plans', '/transports', '/transports/:id'],
    {
      exact: true,
    }
  )

  const rootView = useRouteMatch({
    path: '/',
    exact: true,
  })

  const bookingDetailView = useRouteMatch({
    path: '/bookings/:id',
    exact: true,
  })

  const transportDetailView = useRouteMatch({
    path: '/transports/:id',
    exact: true,
  })

  const planView = useRouteMatch({
    path: '/plans',
  })

  const planRouteDetailsView = useRouteMatch({
    path: '/plans/routes/:routeId',
    exact: true,
  })

  const includeBookingRouteIfDetailView = (booking) => {
    if (bookingDetailView) {
      return booking
    }

    const { route, ...rest } = booking

    return rest
  }

  const includeOneBookingIfDetailView = (booking) =>
    bookingDetailView ? bookingDetailView.params.id === booking.id : true

  const includeOneTransportIfDetailView = (transport) =>
    transportDetailView ? transportDetailView.params.id === transport.id : true

  const includeOnePlanRouteIfDetailView = (route) =>
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
      vehicles:
        includeTransports || rootView
          ? state.vehicles.filter(includeOneTransportIfDetailView)
          : [],
      plan: planView
        ? state.plan
            .map((r, i) => ({ ...r, routeIndex: i }))
            .filter(includeOnePlanRouteIfDetailView)
        : [],
    },
  }
}

const useGetSuggestedAddresses = (initialState) => {
  const [suggested, set] = React.useState(initialState)
  const find = (query, callback) =>
    helpers
      .findAddress(query)
      .then(({ features }) => {
        const parsedFeatures = features.map(
          ({
            geometry: {
              coordinates: [lon, lat],
            },
            properties: { name, county },
          }) => ({
            name,
            county,
            lon,
            lat,
          })
        )
        set(parsedFeatures)

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

const useFormStateWithMapClickControl = (start, end, set) => {
  const [UIState, UIStateDispatch] = stores.ui((state) => [
    state,
    state.dispatch,
  ])

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
              ...current.startPosition,
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
              ...current.endPosition,
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

      return UIStateDispatch({ type: 'resetInputClickState' })
    }
  }, [
    UIStateDispatch,
    UIState.lastClickedPosition,
    UIState.lastFocusedInput,
    set,
    start,
    end,
  ])

  React.useEffect(() => {
    return () => UIStateDispatch({ type: 'resetInputClickState' })
  }, [UIStateDispatch])
}

export default {
  useFilteredStateFromQueryParams,
  useGetSuggestedAddresses,
  useFormStateWithMapClickControl,
}
