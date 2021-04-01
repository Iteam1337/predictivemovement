import React from 'react'
import { useSocket } from 'use-socketio'
import SignParcel from './components/SignParcel'
import { Route, Switch } from 'react-router-dom'
import { Booking } from './types/booking'
import { SignParcelValues } from './types/signature'

function App() {
  const { socket } = useSocket()
  const [bookings, setBookings] = React.useState<Booking[]>()

  useSocket('bookings', (data: any) => {
    setBookings(data)
  })

  const createDeliverySignature = (params: SignParcelValues) =>
    socket.emit('signed-delivery', params)

  return (
    <div>
      <Switch>
        <Route exact path="/sign-delivery/:transportId/:bookingId">
          <SignParcel onSubmit={createDeliverySignature} bookings={bookings} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
