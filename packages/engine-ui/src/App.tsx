import React from 'react'
import { useSocket } from 'use-socketio'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import SignParcel from './SignParcel'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  useSocket('bookings', (bookings) => {
    dispatch({
      type: 'setBookings',
      payload: bookings,
    })
  })

  useSocket('delete-booking', (bookingId) => {
    dispatch({
      type: 'deleteBooking',
      payload: bookingId,
    })
  })

  useSocket('transport-updated', (msg) => {
    dispatch({
      type: 'updateTransport',
      payload: msg,
    })
  })

  useSocket('transport-deleted', (transportId) => {
    dispatch({
      type: 'deleteTransport',
      payload: transportId,
    })
  })

  useSocket('transports', (newTransports) => {
    dispatch({
      type: 'setTransports',
      payload: newTransports,
    })
  })

  useSocket('plan-update', (plan) => {
    dispatch({
      type: 'setPlan',
      payload: {
        routes: plan.transports,
        excludedBookings: plan.excludedBookingIds,
      },
    })
  })

  const handleParcelSignatureConfirm = (signature: string) => {
    console.log(signature)
  }

  return (
    <Switch>
      <Route path="/sign/:id">
        <SignParcel onSubmit={handleParcelSignatureConfirm} />
      </Route>

      <Route path="/">
        <Home {...state} />
      </Route>
    </Switch>
  )
}

export default App
