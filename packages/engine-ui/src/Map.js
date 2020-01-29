import React, { useState } from 'react'
import ReactMapGL, { Layer, Source, Popup } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import palette from './palette'

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

  const [carLines, setCarLines] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('cars', newCars => {
    console.log('newCars', newCars)
    const features = [
      ...cars.features.filter(car => !newCars.some(nc => nc.id === car.id)),
      ...newCars.flatMap(({ id, tail, position, heading }, i) => [
        {
          type: 'Feature',
          properties: {
            color: palette[i][0],
          },
          id,
          tail,
          geometry: {
            type: 'Point',
            coordinates: [position.lon, position.lat],
          },
        },
        {
          type: 'Feature',
          properties: {
            color: palette[i][3],
          },
          id,
          tail,
          geometry: {
            type: 'Point',
            coordinates: [heading.lon, heading.lat],
          },
        },
      ]),
    ]
    const carLineFeatures = [
      ...carLines.features.filter(
        carLine => !newCars.some(nc => 'detour-line' + nc.id === carLine.id)
      ),
      ...newCars.flatMap(({ id, tail, position, detour }) => ({
        id: 'detour-line' + id,
        type: 'Feature',
        properties: {
          color: 'rgba(00, 255, 00, 55)',
        },
        geometry: detour.geometry,
      })),
    ]
    setCars({ ...cars, features })
    setCarLines({ ...carLines, features: carLineFeatures })
  })

  const [bookings, setBookings] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  const [popupInfo, setPopupInfo] = useState(null)

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
    <ReactMapGL
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      pitch={40}
      {...mapState.viewport}
      onViewportChange={viewport => setMapState({ viewport })}
      onClick={event =>
        event.features[0] &&
        !Array.isArray(event.features[0].geometry.coordinates[0])
          ? setPopupInfo({
              carId: event.features[0].id,
              coordinates: event.features[0].geometry.coordinates,
            })
          : setPopupInfo(null)
      }
    >
      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          {popupInfo.carId && `CarId: ${popupInfo.carId},`}
          Coordinates:
          {`${popupInfo.coordinates[0]} ${popupInfo.coordinates[1]}`}
        </Popup>
      )}
      <Source id="cars-source" type="geojson" data={cars}>
        <Layer
          id="car-point"
          type="circle"
          paint={{
            'circle-radius': 10,
            'circle-color': ['get', 'color'],
          }}
        />
      </Source>
      <Source id="cars-line" type="geojson" data={carLines}>
        <Layer
          id="line-id"
          type="line"
          paint={{ 'line-color': ['get', 'color'] }}
        />
      </Source>

      <Source id="bookings-source" type="geojson" data={bookings}>
        <Layer
          id="booking-point"
          type="circle"
          paint={{
            'circle-color': ['get', 'color'],
            'circle-radius': 10,
          }}
        />
        <Layer
          id="line"
          type="line"
          paint={{ 'line-color': ['get', 'color'] }}
        />
      </Source>
    </ReactMapGL>
  )
}

export default Map
