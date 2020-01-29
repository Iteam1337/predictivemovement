import React, { useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import mapUtils from './utils/mapUtils'

export const BookingsLayer = () => {
  const [bookings, setBookings] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('bookings', newBookings => {
    const bookingFeatures = newBookings.flatMap(
      ({ id, departure, destination }) => [
        mapUtils.point([departure.lon, departure.lat], {
          id,
          properties: {
            color: '#455DF7', // blue
          },
        }),
        mapUtils.point([destination.lon, destination.lat], {
          id,
          properties: { color: '#F7455D' },
        }),
        mapUtils.line(
          [
            [destination.lon, destination.lat],
            [departure.lon, departure.lat],
          ],
          {
            id,
            properties: {
              color: '#dd0000',
            },
          }
        ),
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
