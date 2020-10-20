import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Route } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import hooks from './utils/hooks'
import Notifications from './components/Notifications'
import * as notificationTypes from './notificationTypes'
import * as types from './types'
import helpers from './utils/helpers'

const App = () => {
  const { socket } = useSocket()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
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

  const getSeverityByEvent = (
    event: notificationTypes.BookingEvents | notificationTypes.TransportEvents
  ) => {
    switch (event) {
      case notificationTypes.BookingEvents.NEW:
      case notificationTypes.BookingEvents.ASSIGNED:
      case notificationTypes.BookingEvents.DELIVERED:
      case notificationTypes.BookingEvents.PICKED_UP:
      case notificationTypes.TransportEvents.NEW:
        return notificationTypes.Severity.SUCCESS
      case notificationTypes.BookingEvents.DELIVERY_FAILED:
        return notificationTypes.Severity.ERROR
    }
  }

  const transportToNotificationEvent = (
    data: types.Transport
  ): notificationTypes.TransportEvent => ({
    type: notificationTypes.Events.TRANSPORT,
    id: data.id,
    event: notificationTypes.TransportEvents.NEW,
    transport: data,
  })

  const bookingToNotificationEvent = (
    data: types.Booking
  ): notificationTypes.BookingEvent => ({
    type: notificationTypes.Events.BOOKING,
    id: data.id,
    event: notificationTypes.BookingEvents.NEW,
    booking: data,
  })

  useSocket('notification', (data: notificationTypes.Notification) => {
    console.log('incoming: ', data)
    const event = helpers.isOfType<types.Transport>(data, 'busy')
      ? transportToNotificationEvent(data)
      : bookingToNotificationEvent(data as types.Booking)

    const notification: notificationTypes.Notification = {
      event,
      entityType: notificationTypes.EntityTypes.BOOKING,
      severity: getSeverityByEvent(event.event),
    }
    console.log(notification)

    updateNotifications((notifications) => [notification, ...notifications])
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
  })

  useSocket('plan-update', (plan) => {
    dispatch({
      type: 'setPlan',
      payload: plan.vehicles,
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
        <Map data={mapData} />
      </Route>
    </>
  )
}

export default App
