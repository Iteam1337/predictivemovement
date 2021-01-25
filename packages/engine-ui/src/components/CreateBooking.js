import React from 'react'

import { useHistory } from 'react-router-dom'
import * as Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './SuccessScreen'
import * as hooks from '../hooks'
import * as stores from '../utils/state/stores'

const parcelSizePresets = {
  small: { weight: 1, measurements: '18x18x18' },
  medium: { weight: 10, measurements: '24x24x24' },
  big: { weight: 50, measurements: '36x36x36' },
}

export const initialState = {
  externalId: '',
  pickup: {
    name: '',
    lat: undefined,
    lon: undefined,
    timeWindows: null,
    street: '',
    city: '',
  },
  delivery: {
    name: '',
    lat: undefined,
    lon: undefined,
    street: '',
    city: '',
    timeWindows: null,
  },
  metadata: {
    cargo: '',
    fragile: false,
    recipient: { name: '', contact: '', info: '' },
    sender: { name: '', contact: '', info: '' },
  },
  size: parcelSizePresets.small,
}

const isValidAddress = ({ lat, lon }) => !!(lat && lon)

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()
  const [isFinished, setIsFinished] = React.useState(false)
  const [formState, setState] = React.useState(initialState)
  const [formErrors, setFormErrors] = React.useState({
    pickup: false,
    delivery: false,
  })
  const setUIState = stores.ui((state) => state.dispatch)

  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setState)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    const validationResult = {
      pickup: isValidAddress(formState.pickup),
      delivery: isValidAddress(formState.delivery),
    }

    if (!validationResult.pickup || !validationResult.delivery) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        pickup: !validationResult.pickup,
        delivery: !validationResult.delivery,
      }))

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
          setFormErrors={setFormErrors}
          formErrors={formErrors}
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          state={formState}
          dispatch={setUIState}
          parcelSizePresets={parcelSizePresets}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default CreateBooking
