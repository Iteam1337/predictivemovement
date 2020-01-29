import React, { useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import palette from './palette'

export const CarsLayer = () => {
  const [cars, setCars] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  const [carLines, setCarLines] = useState({
    type: 'FeatureCollection',
    features: [],
  })

  useSocket('cars', newCars => {
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
  return (
    <>
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
    </>
  )
}

export default CarsLayer
