import React from 'react'
import mapUtils from './utils/mapUtils'
import Map from './components/Map'
import Hooks from './Hooks'

const Start = ({ state }) => {
  const { data } = Hooks.useFilteredStateFromQueryParams(state)

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(data.bookings)
    ),
    mapUtils.toIconLayer(mapUtils.carToFeature(state.cars)),
  ]

  return <Map layers={layers} state={state} />
}

export default Start
