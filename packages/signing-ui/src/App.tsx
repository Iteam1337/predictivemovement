import React from 'react'
import { useSocket } from 'use-socketio'
import SignParcel from './components/SignParcel'
import { Route, Switch } from 'react-router-dom'
import { Booking } from './types/booking'

function App() {
  const { socket } = useSocket()
  // const [bookings, setBookings] = React.useState<Booking[]>({[]})

  useSocket('bookingsSign', (bookings: Booking[]) => {
    console.log('hej')
    console.log('bookings', bookings)
  })

  const createDeliverySignature = (
    type: string,
    bookingId: string,
    transportId: string,
    signature: string,
    signedBy: string,
    createdAt: Date
  ) => {
    console.log(type)
    socket.emit('signed-delivery', {
      type,
      bookingId,
      transportId,
      receipt: { base64Signature: signature },
      signedBy,
      createdAt,
    })
  }

  const testConnection = () => {
    console.log('klick')
    socket.emit('test', 'HEJ HÄR ÄR SIGN')
  }
  return (
    <div>
      <Switch>
        <Route path="/">
          <SignParcel onSubmit={createDeliverySignature} />
        </Route>
        <Route exact path="/sign-delivery/:transportId/:bookingId"></Route>
      </Switch>
      <button onClick={testConnection}>HEJ</button>
    </div>
  )
}

export default App
