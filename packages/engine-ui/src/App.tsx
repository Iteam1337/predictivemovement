import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Route, useHistory } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import * as hooks from './utils/hooks'
import Notifications from './components/Notifications'
import * as notificationTypes from './notificationTypes'

const App = () => {
  const { socket } = useSocket()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
  const [notifications, updateNotifications] = React.useState<
    notificationTypes.Notification[]
  >([])
  const history = useHistory()
  const handleMapClickEvent = (event: any) => {
    if (!event.object) return
    const type = event.object.properties.type
    switch (type) {
      case 'booking':
        return history.push(`/bookings/${event.object.id}`)
      case 'plan':
        return history.push(`/transports/${event.object.id}`)
      default:
        return
    }
  }

  const layers = hooks.useMapLayers(mapData, handleMapClickEvent)

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

  useSocket('notification', (data: notificationTypes.Notification) => {
    updateNotifications((notifications) => notifications.concat(data))
  })

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
        excludedBookings: plan.excluded_booking_ids,
      },
    })
  })

  return (
    <>
      <Logotype />
      <Notifications
        notifications={notifications}
        updateNotifications={updateNotifications}
      />
      <Sidebar
        {...state}
        createBooking={createBooking}
        dispatchOffers={dispatchOffers}
        createTransport={createTransport}
        deleteBooking={deleteBooking}
        deleteTransport={deleteTransport}
      />
      <Route path="/">
        <Map layers={layers} handleMapClick={handleMapClickEvent} />
      </Route>
    </>
  )
}

export default App
