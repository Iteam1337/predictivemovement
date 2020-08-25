import React from 'react'
import { useLocation } from 'react-router-dom'
import helpers from './helpers'

const useFilteredStateFromQueryParams = (state) => {
  const useQueryParams = () => new URLSearchParams(useLocation().search)
  const type = useQueryParams().get('type')
  const id = useQueryParams().get('id')
  const status = useQueryParams().get('status')

  const statuses = status ? status.split(',') : []

  return {
    type,
    id,
    data: {
      ...state,
      bookings: state.bookings
        .filter((item) => (type === 'booking' ? item.id === id : true))
        .filter((item) =>
          statuses.length ? statuses.includes(item.status) : true
        ),
      cars: state.cars.filter((item) =>
        type === 'vehicle' ? item.id.toString() === id : true
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
