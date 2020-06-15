import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Map from './components/Map'

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
        <Sidebar
          {...state}
          createBooking={createBooking}
          dispatchOffers={dispatchOffers}
          addVehicle={addVehicle}
        />
        <Route path="/">
          <Map onMapClick={onMapClick} state={state} />
        </Route>
      </Router>
    </>
  )
}

export default App
