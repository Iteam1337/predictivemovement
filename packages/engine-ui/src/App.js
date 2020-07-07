import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { socket } = useSocket()

  const onMapClick = ({ lngLat }) => {
    dispatch({
      type: 'setPosition',
      payload: { lat: lngLat[1], lon: lngLat[0] },
    })
  }

  const addVehicle = (position) => {
    socket.emit('add-vehicle', {
      position,
    })
  }

  const createBooking = ({ pickup, delivery }) => {
    socket.emit('new-booking', {
      pickup,
      delivery,
    })
  }

  const dispatchOffers = () => {
    socket.emit('dispatch-offers')
  }

  const createBookings = (total) => {
    socket.emit('new-bookings', {
      total,
    })
  }

  const resetState = () => {
    dispatch({
      type: 'clearState',
    })
    socket.emit('reset-state')
  }

  useSocket('bookings', (bookings) => {
    dispatch({
      type: 'setBookings',
      payload: bookings,
    })
  })

  useSocket('cars', (newCars) => {
    dispatch({
      type: 'setCars',
      payload: newCars,
    })
  })

  return (
    <>
      <Router>
        <Logotype />
        <Sidebar
          {...state}
          createBooking={createBooking}
          dispatchOffers={dispatchOffers}
          resetState={resetState}
          addVehicle={addVehicle}
          createBookings={createBookings}
        />
        <Route path="/">
          <Map onMapClick={onMapClick} state={state} />
        </Route>
      </Router>
    </>
  )
}

export default App
