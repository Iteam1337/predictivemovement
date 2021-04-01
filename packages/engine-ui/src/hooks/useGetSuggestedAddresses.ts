import React from 'react'
import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'

const useGetSuggestedAddresses = (initialState = []) => {
  const [suggested, set] = React.useState(initialState)
  const viewState = stores.map((state) => state)

  const find = (query: string, callback: () => void) =>
    helpers
      .findAddress(query, viewState)
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

export default useGetSuggestedAddresses
