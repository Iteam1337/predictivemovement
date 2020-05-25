import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Start from './Start'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { socket } = useSocket()

  const createBooking = ({ pickup, dropoff }) => {
    socket.emit('new-booking', {
      pickup,
      dropoff,
    })
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
        <Switch>
          <Route path="/:details?/:id?">
            <Sidebar {...state} createBooking={createBooking} />
            <Start state={state} />
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default App
