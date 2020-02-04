import React from 'react'
import Map from './components/Map'
import { SocketIOProvider } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'

const App = () => {
  const [carInfo, setCarInfo] = React.useState({
    data: {},
    x: null,
    y: null,
  })

  return (
    <SocketIOProvider url="http://localhost:4000">
      <Sidebar {...carInfo} />

      <Map setCarInfo={setCarInfo} />
    </SocketIOProvider>
  )
}

export default App
