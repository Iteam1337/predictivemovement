import React from 'react'
import mapUtils from './utils/mapUtils'
import Map from './components/Map'
import { useParams } from 'react-router-dom'

const Start = ({ state }) => {
  const { id } = useParams()

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(
        id
          ? state.bookings.filter((booking) => booking.id === id)
          : state.bookings
      )
    ),
    mapUtils.toIconLayer(mapUtils.carToFeature(state.cars)),
  ]

  return <Map layers={layers} state={state} />
}

export default Start
