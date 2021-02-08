import React from 'react'
import { useSocket } from 'use-socketio'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Route, Switch } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import Notifications from './components/Notifications'
import * as notificationTypes from './notificationTypes'
import * as stores from './utils/state/stores'
import * as types from './types'
import NotFound from './components/NotFound'
import Sidebar from './components/Sidebar'
import SignParcel from './SignParcel'

const App = () => {
  const { socket } = useSocket()

  const [notifications, updateNotifications] = React.useState<
    notificationTypes.Notification[]
  >([])

  const setDataState = stores.dataState(
    React.useCallback((state) => state.set, [])
  )

  const isMobile = window.innerWidth <= 645

  const createDeliverySignature = (
    bookingId: string,
    transportId: string,
    signature: string,
    signedBy: string,
    createdAt: Date
  ) => {
    socket.emit('signed-delivery', {
      bookingId,
      transportId,
      signature,
      signedBy,
      createdAt,
    })
  }

  const createTransport = (params: any) => {
    socket.emit('create-transport', params)
  }

  const createBooking = (params: any) => {
    socket.emit('new-booking', params)
  }

  const dispatchOffers = () => {
    socket.emit('dispatch-offers')
  }

  const deleteBooking = (id: string) => {
    socket.emit('delete-booking', id)
  }

  const deleteTransport = (id: string) => {
    socket.emit('delete-transport', id)
  }

  const moveBooking = (bookingId: string, transportId: string) => {
    socket.emit('move-booking', { bookingId, transportId })
  }

  const updateBooking = (booking: any) => {
    socket.emit('update-booking', booking)
  }

  const updateTransport = (transport: any) => {
    socket.emit('update-transport', transport)
  }

  useSocket('notification', (data: notificationTypes.Notification) => {
    updateNotifications((notifications) => notifications.concat(data))
  })

  useSocket('bookings', (bookings: types.Booking[]) => {
    setDataState({ type: 'setBookings', payload: bookings })
  })

  useSocket('delete-booking', (bookingId: string) => {
    setDataState({ type: 'deleteBooking', payload: bookingId })
  })

  useSocket('transport-updated', (transport: types.Transport) => {
    setDataState({ type: 'updateTransport', payload: transport })
  })

  useSocket('transport-deleted', (transportId: string) => {
    setDataState({ type: 'deleteTransport', payload: transportId })
  })

  useSocket('transports', (transports: types.Transport[]) => {
    setDataState({ type: 'setTransports', payload: transports })
  })

  useSocket('plan-update', (params) => {
    setDataState({
      type: 'setPlan',
      payload: {
        routes: params.transports,
        excludedBookings: params.excludedBookingIds,
      },
    })
  })

  return (
    <>
      {!isMobile && <Logotype />}
      <Notifications
        notifications={notifications}
        updateNotifications={updateNotifications}
      />
      <Switch>
        <Route exact path="/sign-delivery/:transportId/:bookingId">
          <SignParcel onSubmit={createDeliverySignature} />
        </Route>

        <Route path={['/bookings', '/']}>
          <Sidebar
            isMobile={isMobile}
            createBooking={createBooking}
            dispatchOffers={dispatchOffers}
            createTransport={createTransport}
            deleteBooking={deleteBooking}
            deleteTransport={deleteTransport}
            moveBooking={moveBooking}
            updateBooking={updateBooking}
            updateTransport={updateTransport}
          />
          {!isMobile && <Map />}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default App
