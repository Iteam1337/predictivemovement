import React from 'react'
import Map from './components/Map'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapUtils from './utils/mapUtils'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-carbookings-layer',
      state.carBookingLineCollection
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(state.bookings)
    ),
    mapUtils.toIconLayer(mapUtils.movingCarToFeature(state.cars), () => {}),
  ]

  return (
    <>
      <Router>
        <Sidebar {...state} createBooking={createBooking} />
        <Route exact path="/">
          <Map layers={layers} state={state} />
        </Route>
        <Route path="/booking/:id">
          <Booking state={state} />
        </Route>
      </Router>
    </>
  )
}

export default App
