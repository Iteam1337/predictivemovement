import React from 'react'
import Map from './components/Map'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapUtils from './utils/mapUtils'
import { reducer, initState } from './utils/reducer'

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { socket } = useSocket()

  const createBooking = ({ pickup, dropoff }) => {
    socket.emit('new-booking', { pickup, dropoff })
  }

  useSocket('bookings', (newBookings) => {
    const features = mapUtils.bookingToFeature(newBookings)
    dispatch({
      type: 'setBookings',
      payload: features,
    })
  })

  useSocket('bookings_delivered', (deliveredBookings) => {
    dispatch({
      type: 'removeBookings',
      payload: deliveredBookings,
    })
  })

  useSocket('cars', (newCars) => {
    const { carLineFeatures, carFeatures } = mapUtils.carToFeature(
      newCars,
      state.carCollection,
      state.carLineCollection
    )

    dispatch({
      type: 'setCars',
      payload: carFeatures,
    })

    dispatch({
      type: 'setCarsLines',
      payload: carLineFeatures,
    })
  })

  useSocket('moving-cars', (newCars) => {
    const movingCarsFeatures = mapUtils.movingCarToFeature(
      newCars,
      state.movingCarsCollection
    )
    dispatch({
      type: 'setMovingCars',
      payload: {
        ...state.movingCarsCollection,
        features: movingCarsFeatures,
      },
    })
  })

  return (
    <>
      <Sidebar {...state.carInfo} createBooking={createBooking} />
      <Map dispatch={dispatch} state={state} />
    </>
  )
}

export default App
