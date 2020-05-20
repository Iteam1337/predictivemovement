import React from 'react'
import mapUtils from './utils/mapUtils'
import Map from './components/Map'
import { useParams } from 'react-router-dom'

const Booking = ({ state }) => {
  const { id } = useParams()

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(
        state.bookings.filter((booking) => booking.id === id)
      )
    ),
  ]
  return <Map layers={layers} />
}

export default Booking
