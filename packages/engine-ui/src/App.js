import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Route } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import { UIStateProvider } from './utils/UIStateContext'
import hooks from './utils/hooks'
import Notifications from './components/Notifications'
import { RecoilRoot } from 'recoil'

const App = () => {
  const { socket } = useSocket()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
  const [notifications, updateNotifications] = React.useState([])
  const addVehicle = (params) => {
    socket.emit('add-vehicle', params)
  }

  const createBooking = (params) => {
    socket.emit('new-booking', params)
  }

  const dispatchOffers = () => {
    socket.emit('dispatch-offers')
  }

  const deleteBooking = (id) => {
    socket.emit('delete-booking', id)
  }

  const deleteVehicle = (id) => {
    socket.emit('delete-vehicle', id)
  }

  useSocket('notification', (notification) => {
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
    <UIStateProvider>
      <RecoilRoot>
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
      </RecoilRoot>
    </UIStateProvider>
  )
}

export default App
