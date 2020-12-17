import React from 'react'
import { useSocket } from 'use-socketio'
import Logotype from './components/Logotype'
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import { State } from './utils/reducer'
import * as hooks from './utils/hooks'
import Notifications from './components/Notifications'
import * as notificationTypes from './notificationTypes'

const Component: React.FC<State> = (state) => {
  const isMobile = window.innerWidth <= 645

  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
  const { socket } = useSocket()

  const [notifications, updateNotifications] = React.useState<
    notificationTypes.Notification[]
  >([])

  useSocket('notification', (data: notificationTypes.Notification) => {
    updateNotifications((notifications) => notifications.concat(data))
  })

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

  return (
    <>
      <Notifications
        notifications={notifications}
        updateNotifications={updateNotifications}
      />
      {!isMobile && <Logotype />}
      <Sidebar
        {...state}
        isMobile={isMobile}
        createBooking={createBooking}
        dispatchOffers={dispatchOffers}
        createTransport={createTransport}
        deleteBooking={deleteBooking}
        deleteTransport={deleteTransport}
        moveBooking={moveBooking}
        updateBooking={updateBooking}
      />
      {!isMobile && <Map data={mapData} state={state} />}
    </>
  )
}

export default Component
