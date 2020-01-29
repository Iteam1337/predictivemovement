import React, { useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import palette from './palette'
import mapUtils from './utils/mapUtils'

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
        mapUtils.point([position.lon, position.lat], {
          properties: { color: palette[i][0] },
          id,
          tail,
        }),
        mapUtils.point([heading.lon, heading.lat], {
          properties: { color: palette[i][0] },
          id,
          tail,
        }),
      ]),
    ]

    const carLineFeatures = [
      ...carLines.features.filter(
        carLine => !newCars.some(nc => nc.id === carLine.id)
      ),

      ...newCars.flatMap(({ id, detour }, i) =>
        mapUtils.feature(detour.geometry, {
          id,
          properties: { color: palette[i][0], offset: i*2 },
        })
      ),
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
          paint={{ 'line-color': ['get', 'color'], 'line-offset': ['get', 'offset'] }}
        />
      </Source>
    </>
  )
}

export default CarsLayer
