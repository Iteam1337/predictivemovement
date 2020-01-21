import React from 'react'
import Map from './Map'
import io from 'socket.io-client'

const App: React.FC = () => {
  const socket = io('http://localhost:4000')
  return (
    <div>
      <Map socket={socket} />
    </div>
  )
}

export default App
