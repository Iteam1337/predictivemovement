import React, { useState } from 'react'
import ReactMapGL, { Layer, Source, Popup } from 'react-map-gl'
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

  useSocket('cars', newCars => {
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

  const [bookingLines, setBookingLines] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  const [popupInfo, setPopupInfo] = useState(null)

  useSocket('bookings', newBookings => {
    console.log('bookings', newBookings)
    const bookingLinesFeature = newBookings.map(
      ({ id, departure, destination }) => ({
        type: 'Feature',
        id,
        geometry: {
          type: 'LineString',
          coordinates: [
            [destination.lon, destination.lat],
            [departure.lon, departure.lat],
          ],
        },
      })
    )
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
      ]
    )

    setBookings({ ...bookings, features: bookingFeatures })
    setBookingLines({ ...bookingLines, features: bookingLinesFeature })
  })

  return (
    <div>
      <ReactMapGL
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...mapState.viewport}
        onViewportChange={viewport => setMapState({ viewport })}
        onClick={event =>
          event.features[0] &&
          setPopupInfo({
            coordinates: event.features[0].geometry.coordinates,
          })
        }
      >
        {popupInfo && (
          <Popup
            longitude={popupInfo.coordinates[0]}
            latitude={popupInfo.coordinates[1]}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            Hi there! 👋 Coordinates:
            {`${popupInfo.coordinates[0]} ${popupInfo.coordinates[1]}`}
          </Popup>
        )}
        <Source id="cars-source" type="geojson" data={cars}>
          <Layer
            id="car-point"
            type="circle"
            paint={{
              'circle-radius': 10,
              'circle-color': '#007cbf',
            }}
            onHover={event => console.log('booking')}
          />
        </Source>

        <Source id="bookings-source" type="geojson" data={bookings}>
          <Layer
            id="booking-point"
            type="circle"
            paint={{
              'circle-color': ['get', 'color'],
              'circle-radius': 20,
            }}
          />
        </Source>

        <Source id="booking-lines-source" type="geojson" data={bookingLines}>
          <Layer id="line" type="line" paint={{ 'line-color': '#dd0000' }} />
        </Source>
      </ReactMapGL>
    </div>
  )
}

export default Map
