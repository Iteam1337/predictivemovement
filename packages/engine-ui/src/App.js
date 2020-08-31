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

const App = () => {
  const { socket } = useSocket()
  const [state, dispatch] = React.useReducer(reducer, initState)

  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)

  const onMapClick = ({ lngLat: [lon, lat] }) => {
    dispatch({
      type: 'setPosition',
      payload: { lat, lon },
    })
  }

  const addVehicle = (params) => {
    socket.emit('add-vehicle', params)
  }

  const createBooking = (params) => {
    socket.emit('new-booking', params)
  }

  const dispatchOffers = () => {
    console.log('user pressed the dispatch button')
    socket.emit('dispatch-offers')
  }

  const createBookings = (total) => {
    socket.emit('new-bookings', {
      total,
    })
  }

  const resetState = () => {
    dispatch({
      type: 'clearState',
    })
    socket.emit('reset-state')
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

  useSocket('plan-update', (plan) => {
    dispatch({
      type: 'setPlan',
      payload: plan.vehicles,
    })
  })

  return (
    <UIStateProvider>
      <Logotype />
      <Sidebar
        {...state}
        createBooking={createBooking}
        dispatchOffers={dispatchOffers}
        resetState={resetState}
        addVehicle={addVehicle}
        createBookings={createBookings}
      />
      <Route path="/">
        <Map onMapClick={onMapClick} data={mapData} />
      </Route>
    </UIStateProvider>
  )
}

export default App
