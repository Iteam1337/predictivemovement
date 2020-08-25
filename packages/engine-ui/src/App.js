import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import { reducer, initState } from './utils/reducer'
import { Route, useLocation } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'
import { ViewportProvider } from './utils/ViewportContext'
import hooks from './utils/hooks'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [highlightedBookingById, setHighlightedBookingById] = React.useState(
    undefined
  )

  const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
  const { socket } = useSocket()

  const location = useLocation()
  const locationIncludesBooking = location.search.includes('booking')

  React.useEffect(() => {
    console.log('running effect')
    if (location.search.includes('booking') && mapData.bookings[0]) {
      setHighlightedBookingById(mapData.bookings[0].id)
    }
  }, [location.search, mapData.bookings])

  const onMapClick = ({ lngLat }) => {
    dispatch({
      type: 'setPosition',
      payload: { lat: lngLat[1], lon: lngLat[0] },
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
    <ViewportProvider>
      <Logotype />
      <Sidebar
        {...state}
        createBooking={createBooking}
        dispatchOffers={dispatchOffers}
        resetState={resetState}
        addVehicle={addVehicle}
        createBookings={createBookings}
        handleHighlightBooking={setHighlightedBookingById}
      />
      <Route path="/">
        <Map
          onMapClick={onMapClick}
          data={mapData}
          highlightedBooking={highlightedBookingById}
          includeBookingRoute={locationIncludesBooking}
        />
      </Route>
    </ViewportProvider>
  )
}

export default App
