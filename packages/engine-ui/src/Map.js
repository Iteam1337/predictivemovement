import React, { useState } from 'react'
import ReactMapGL, { Layer, Source } from 'react-map-gl'
import { useSocket } from "use-socketio";

const Map = () => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
      pitch: 40
    },
  })
  const [cars, setCars] = useState({
    type: 'FeatureCollection',
    features: []
  })

  const { socket, subscribe, unsubscribe } = useSocket("cars", newCars => {
    const features = [...cars.features.filter(car => !newCars.some(nc => nc.id === car.id)), ...newCars.map(car => (
      { type: 'Feature', id: car.id, geometry: {type: 'Point', coordinates: [car.position[0], car.position[1]]}}
    ))]
    console.log('cars', cars)
    setCars(Object.assign({}, cars, {features}))
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
              'circle-color': '#007cbf'
            }} />
        </Source>
      </ReactMapGL>
    </div>
  )
}

export default Map
