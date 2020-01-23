import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSocket } from "use-socketio";

const Map: React.FC = () => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
    },
  })
  const [cars, setCars] = useState([]);

  const { socket, subscribe, unsubscribe } = useSocket("cars", newCars => {
    console.log('newCars', newCars)
    setCars(newCars)
  })

  return (
    <div>
      <ReactMapGL
        width="100%"
        height="100vh"

        {...mapState.viewport}
        onViewportChange={viewport => setMapState({ viewport })}
      />
    </div>
  )
}

export default Map
