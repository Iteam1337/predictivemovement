import React, { useState } from 'react'
import ReactMapGL, { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'

const Map = () => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
    },
  })
  const [cars, setCars] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  const { socket, subscribe, unsubscribe } = useSocket('cars', newCars => {
    const features = [
      ...cars.features.filter(car => !newCars.some(nc => nc.id === car.id)),
      ...newCars.map(({ id, tail, position: coordinates }) => ({
        type: 'Feature',
        id,
        tail,
        geometry: { type: 'Point', coordinates },
      })),
    ]

    setCars({ ...cars, features })
  })

  const [bookings, setBookings] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('bookings', newBookings => {
    console.log('bookings', bookings)
    const bookingFeatures = newBookings.map(
      ({ id, departure, destination }) => ({
        type: 'Feature',
        id,
        geometry: {
          type: 'Point',
          coordinates: [departure.lon, departure.lat],
        },
      })
    )

    setBookings({ ...bookings, features: bookingFeatures })
  })

  return (
    <div>
      <ReactMapGL
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...mapState.viewport}
        onViewportChange={viewport => setMapState({ viewport })}
      >
        {/* <Source id="cars-source" type="geojson" data={cars}>
          <Layer
            id="point"
            type="circle"
            paint={{
              'circle-radius': 10,
              'circle-color': '#007cbf',
            }}
          />
        </Source> */}

        <Source id="bookings-source" type="geojson" data={bookings}>
          <Layer
            id="point"
            type="circle"
            paint={{
              'circle-radius': 20,
              'circle-color': '#ff0000',
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  )
}

export default Map
