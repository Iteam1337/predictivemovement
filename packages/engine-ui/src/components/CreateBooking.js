import React from 'react'

import { useHistory } from 'react-router-dom'
import * as Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './CreateSuccess'
import * as hooks from '../utils/hooks'
import * as stores from '../utils/state/stores'

const initialState = {
  id: '',
  cargo: '',
  fragile: false,
  pickup: {
    name: '',
    lat: undefined,
    lon: undefined,
    timewindow: null,
    street: '',
    city: '',
  },
  delivery: {
    name: '',
    lat: undefined,
    lon: undefined,
    street: '',
    city: '',
    timewindow: null,
  },
  size: {
    measurements: '',
    weight: '',
  },
  sender: { name: '', contact: '', info: '' },
  recipient: { name: '', contact: '', info: '' },
}

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()
  const [isFinished, setIsFinished] = React.useState(false)
  const [formState, setState] = React.useState(initialState)
  const setUIState = stores.ui((state) => state.dispatch)

  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setState)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (
      !formState.pickup.lat ||
      !formState.pickup.lon ||
      !formState.delivery.lat ||
      !formState.delivery.lon
    ) {
      return false
    }

    onSubmit({
      ...formState,
      size: {
        ...formState.size,
        measurements: formState.size.measurements
          ? formState.size.measurements.split('x').map(parseFloat)
          : null,
        weight: parseInt(formState.size.weight) || 0,
      },
    })

    return setIsFinished(true)
  }

  const handleOnContinue = () => {
    setState(initialState)
    setIsFinished(false)
  }

  const handleOnClose = () => history.push('/bookings')

  if (isFinished)
    return (
      <Success
        onClose={handleOnClose}
        onContinue={handleOnContinue}
        infoText="Bokningen är nu tillagd!"
      />
    )

  return (
    <MainRouteLayout redirect="/bookings">
      <Elements.Layout.Container>
        <h3>Lägg till bokning</h3>
        <Form
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          state={formState}
          dispatch={setUIState}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default CreateBooking
