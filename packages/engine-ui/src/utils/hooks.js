import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import helpers from './helpers'
import { UIStateContext } from './UIStateContext'

const useFilteredStateFromQueryParams = (state) => {
  const bookingDetailView = useRouteMatch({
    path: '/bookings/:id',
    exact: true,
  })

  const vehicleDetailView = useRouteMatch({
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

  const includeRoute = (booking) => {
    const { route, ...rest } = booking

    if (bookingDetailView) {
      return booking
    }

    return rest
  }

  const includeOneIfDetailView = (booking) => {
    if (!bookingDetailView) return true

    return booking.id === bookingDetailView.params['id'] || false
  }

  return {
    data: {
      ...state,
      bookings: state.bookings.map(includeRoute).filter(includeOneIfDetailView),

      cars: state.cars.filter((item) =>
        vehicleDetailView ? vehicleDetailView.params.id === item.id : true
      ),
      plan: planView
        ? state.plan
            .map((r, i) => ({ ...r, routeIndex: i }))
            .filter((route) =>
              planRouteDetailsView
                ? planRouteDetailsView.params.routeId === route.id
                : true
            )
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
  const { state: UIState, dispatch: UIStateDispatch } = React.useContext(
    UIStateContext
  )
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
