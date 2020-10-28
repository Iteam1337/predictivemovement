import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './CreateSuccess'
import hooks from '../utils/hooks'
import stores from '../utils/state/stores'

const initialState = {
  externalId: '',
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
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default CreateBooking
