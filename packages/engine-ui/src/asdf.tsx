import React, { useState } from 'react'
import ReactMapGL, { Layer, Source, MapStateProps, Marker } from 'react-map-gl'
import { useSocket } from 'use-socketio'

interface CarCollection extends GeoJSON.FeatureCollection<GeoJSON.Point> {
  tail: any[]
}

interface MapState {
  viewport: MapStateProps
}

const Map = () => {
  const [mapState, setMapState] = useState<MapState>({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
      pitch: 40,
    },
  })

  const [cars, setCars] = useState<CarCollection>({
    type: 'FeatureCollection',
    features: [],
    tail: [],
  })

  useSocket('cars', newCars => {
    const features = [
      ...cars.features.filter(
        car => !newCars.some((nc: any) => nc.id === car.id)
      ),
      ...newCars.map(
        ({ id, tail, position }: { id: any; tail: any; position: any }) => ({
          type: 'Feature',
          id,
          tail,
          geometry: { type: 'Point', coordinates: [position[0], position[1]] },
        })
      ),
    ]
    console.log('cars', cars)
    setCars(Object.assign({}, cars, { features }))
  })

  return (
    <div>
      <ReactMapGL
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        {...mapState.viewport}
        onViewportChange={viewport => setMapState({ viewport })}
      >
        <Source id="my-data" type="geojson" data={cars}>
          <Layer
            id="point"
            type="circle"
            paint={{
              'circle-radius': 10,
              'circle-color': '#007cbf',
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  )
}

export default Map
