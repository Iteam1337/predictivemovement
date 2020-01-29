import React, { useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'

export const BookingsLayer = () => {
  const [bookings, setBookings] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('bookings', newBookings => {
    const bookingFeatures = newBookings.flatMap(
      ({ id, departure, destination }) => [
        {
          type: 'Feature',
          id: 'booking-departure-' + id,
          properties: {
            color: '#455DF7', // blue
          },
          geometry: {
            type: 'Point',
            coordinates: [departure.lon, departure.lat],
          },
        },
        {
          type: 'Feature',
          id: 'booking-destination' + id,
          properties: {
            color: '#F7455D', // red
          },
          geometry: {
            type: 'Point',
            coordinates: [destination.lon, destination.lat],
          },
        },
        {
          type: 'Feature',
          id: 'booking-line-' + id,
          properties: {
            color: '#dd0000',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [destination.lon, destination.lat],
              [departure.lon, departure.lat],
            ],
          },
        },
      ]
    )

    setBookings({ ...bookings, features: bookingFeatures })
  })

  return (
    <Source id="bookings-source" type="geojson" data={bookings}>
      <Layer
        id="booking-point"
        type="circle"
        paint={{
          'circle-color': ['get', 'color'],
          'circle-radius': 10,
        }}
      />
      <Layer id="line" type="line" paint={{ 'line-color': ['get', 'color'] }} />
    </Source>
  )
}

export default BookingsLayer
