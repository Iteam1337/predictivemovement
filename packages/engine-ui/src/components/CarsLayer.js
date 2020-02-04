import React, { useState } from 'react'
import { Layer, Source } from 'react-map-gl'
import { useSocket } from 'use-socketio'
import palette from '../palette'
import mapUtils from '../utils/mapUtils'
import { GeoJsonLayer } from '@deck.gl/layers'

export const CarsLayer = () => {
  return (
    <>
      <GeoJsonLayer data={cars} />
      {/* <Source id="cars-source" type="geojson" data={cars}>
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
          paint={{
            'line-color': ['get', 'color'],
            'line-offset': ['get', 'offset'],
          }}
        />
      </Source> */}
    </>
  )
}

export default CarsLayer
