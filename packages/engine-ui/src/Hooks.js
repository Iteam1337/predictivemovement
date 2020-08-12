import React from 'react'
import { useLocation } from 'react-router-dom'
import helpers from './utils/helpers'

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
        type === 'car' ? item.id.toString() === id : true
      ),
    },
  }
}

const useGetSuggestedAddresses = (initialState) => {
  const [suggested, set] = React.useState(initialState)
  const find = (propertyName, searchTerm, callback) =>
    helpers.findAddress(searchTerm).then(({ features }) => {
      set((currentState) => ({
        ...currentState,
        [propertyName]: features.map(
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
        ),
      }))

      return callback()
    })

  return [find, suggested]
}

export default { useFilteredStateFromQueryParams, useGetSuggestedAddresses }
