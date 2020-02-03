import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'
import CarsLayer from './CarsLayer'
import BookingsLayer from './BookingsLayer'

const Map = ({ setCarInfo }) => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
    },
  })

  return (
    <ReactMapGL
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      pitch={40}
      {...mapState.viewport}
      onViewportChange={viewport => setMapState({ viewport })}
      onNativeClick={event =>
        event.features[0] &&
        !Array.isArray(event.features[0].geometry.coordinates[0]) &&
        setCarInfo({
          carId: event.features[0].id,
          coordinates: event.features[0].geometry.coordinates,
          diff: JSON.parse(event.features[0].properties.diff),
        })
      }
    >
      <CarsLayer />
      <BookingsLayer />
    </ReactMapGL>
  )
}

export default Map
