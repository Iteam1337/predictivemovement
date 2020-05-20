import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Start from './Start'
import Booking from './Booking'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { socket } = useSocket()

  const createBooking = ({ pickup, dropoff }) => {
    socket.emit('new-booking', {
      pickup,
      dropoff,
    })
  }

  useSocket('bookings', (newBookings) => {
    dispatch({
      type: 'setBookings',
      payload: newBookings,
    })
  })

  useSocket('bookings_delivered', (deliveredBookings) => {
    dispatch({
      type: 'removeBookings',
      payload: deliveredBookings,
    })
  })

  useSocket('booking-assigned', (assignedBookings) => {
    dispatch({
      type: 'setBookings',
      payload: assignedBookings.map(({ booking }) => booking),
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
        <Sidebar {...state} createBooking={createBooking} />
        <Route exact path="/">
          <Start state={state} />
        </Route>
        <Route path="/booking/:id">
          <Booking state={state} />
        </Route>
      </Router>
    </>
  )
}

export default App
