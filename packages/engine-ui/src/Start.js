import React from 'react'
import mapUtils from './utils/mapUtils'
import Map from './components/Map'

const Start = ({ state }) => {
  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-carbookings-layer',
      state.carBookingLineCollection
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(state.bookings)
    ),
    mapUtils.toIconLayer(mapUtils.movingCarToFeature(state.cars)),
  ]

  return <Map layers={layers} state={state} />
}

export default Start
