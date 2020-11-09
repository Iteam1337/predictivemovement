import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Route } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import Notifications from './components/Notifications'
import * as types from './types'
import * as notificationTypes from './notificationTypes'
import * as stores from './utils/state/stores'
import { getColor } from './utils/palette'

const App = () => {
  const { socket } = useSocket()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const mapState = stores.mapData((state) => state)

  const [notifications, updateNotifications] = React.useState<
    notificationTypes.Notification[]
  >([])

  const addVehicle = (params: any) => {
    socket.emit('add-vehicle', params)
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

  const deleteVehicle = (id: string) => {
    socket.emit('delete-vehicle', id)
  }

  useSocket('notification', (data: notificationTypes.Notification) => {
    updateNotifications((notifications) => notifications.concat(data))
  })

  useSocket('bookings', (bookings) => {
    dispatch({
      type: 'setBookings',
      payload: bookings,
    })
    mapState.set({ bookings })
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

  useSocket('vehicle-deleted', (vehicleId) => {
    dispatch({
      type: 'deleteVehicle',
      payload: vehicleId,
    })
  })

  useSocket('vehicles', (newVehicles) => {
    dispatch({
      type: 'setTransports',
      payload: newVehicles,
    })
    mapState.set({
      transports: [
        ...mapState.transports.filter(
          (c) => !newVehicles.find((p: types.Transport) => p.id === c.id)
        ),
        ...newVehicles,
      ].map((v, i) => ({ ...v, color: getColor(i, 0) })),
    })
  })

  useSocket('plan-update', (plan) => {
    dispatch({
      type: 'setPlan',
      payload: {
        routes: plan.vehicles,
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
        addVehicle={addVehicle}
        deleteBooking={deleteBooking}
        deleteVehicle={deleteVehicle}
      />
      <Route path="/">
        <Map />
      </Route>
    </>
  )
}

export default App
