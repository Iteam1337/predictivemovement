import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import { ViewportProvider } from './utils/ViewportContext'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { socket } = useSocket()

  const onMapClick = ({ lngLat }) => {
    dispatch({
      type: 'setPosition',
      payload: { lat: lngLat[1], lon: lngLat[0] },
    })
  }

  const addVehicle = (params) => {
    socket.emit('add-vehicle', params)
  }

  const createBooking = (params) => {
    socket.emit('new-booking', params)
  }

  const dispatchOffers = () => {
    console.log('user pressed the dispatch button')
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
    <ViewportProvider>
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
    </ViewportProvider>
  )
}

export default App
