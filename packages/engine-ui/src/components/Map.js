import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import mapUtils, { hexToRGBA } from '../utils/mapUtils'
import palette from '../palette'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'

const Map = ({ setCarInfo }) => {
  const [mapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 10,
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

  const [bookings, setBookings] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('bookings', newBookings => {
    const bookingFeatures = newBookings.flatMap(
      ({ id, departure, destination }) => [
        mapUtils.multiPoint(
          [
            [departure.lon, departure.lat],
            [destination.lon, destination.lat],
          ],
          {
            id,
            properties: {
              color: '#455DF7', // blue
            },
          }
        ),
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

  const diff = (
    { route: { distance: headingDistance, duration: headingDuration } },
    { distance: detourDistance, duration: detourDuration }
  ) => ({
    duration: detourDuration - headingDuration,
    distance: detourDistance - headingDistance,
  })

  useSocket('cars', newCars => {
    const features = [
      ...cars.features.filter(car => !newCars.some(nc => nc.id === car.id)),
      ...newCars.flatMap(({ id, tail, position, heading, detour }, i) => [
        mapUtils.multiPoint(
          [
            [position.lon, position.lat],
            [heading.lon, heading.lat],
          ],
          {
            properties: {
              color: palette[i][0],
              diff: diff(heading, detour),
            },
            id,
            tail,
          }
        ),
      ]),
    ]

    const carLineFeatures = [
      ...carLines.features.filter(
        carLine => !newCars.some(nc => nc.id === carLine.id)
      ),

      ...newCars.flatMap(({ id, detour }, i) =>
        mapUtils.feature(detour.geometry, {
          id,
          properties: { color: palette[i][0], offset: i * 2 },
        })
      ),
    ]
    setCars({ ...cars, features })
    setCarLines({ ...carLines, features: carLineFeatures })
  })

  const toGeoJsonLayer = (id, data, callback) =>
    new GeoJsonLayer({
      id,
      data,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: d => hexToRGBA(d.properties.color, 255),
      highlightColor: [104, 211, 245, 255],
      autoHighlight: true,
      getLineColor: d => hexToRGBA(d.properties.color, 100),
      getRadius: 300,
      getLineWidth: 5,
      getElevation: 30,
      onHover: ({ object, x, y }) => object && callback({ data: object, x, y }),
    })

  return (
    <DeckGL
      initialViewState={mapState.viewport}
      layers={[
        toGeoJsonLayer('geojson-carline-layer', carLines, setCarInfo),
        toGeoJsonLayer('geojson-cars-layer', cars, setCarInfo),
        toGeoJsonLayer('geojson-bookings-layer', bookings, () => {}),
      ]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
