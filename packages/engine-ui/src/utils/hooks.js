import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import helpers from './helpers'

const useFilteredStateFromQueryParams = (state) => {
  const bookingDetailView = useRouteMatch({
    path: '/bookings/:id',
    exact: true,
  })
  // const bookingOverview = useRouteMatch({ path: '/bookings', exact: true })
  const vehicleDetailView = useRouteMatch({
    path: '/vehicles/:id',
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
      plan: state.plan,
    },
  }
}

const useGetSuggestedAddresses = (initialState) => {
  const [suggested, set] = React.useState(initialState)
  const find = (query, callback) =>
    helpers
      .findAddress(query)
      .then(({ features }) => {
        set(
          features.map(
            ({
              geometry: {
                coordinates: [lon, lat],
              },
              properties: { name },
            }) => ({
              name,
              lon,
              lat,
            })
          )
        )

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

export default { useFilteredStateFromQueryParams, useGetSuggestedAddresses }
