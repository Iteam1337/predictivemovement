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
  id: '',
  measurement: '',
  weight: '',
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
  sender: { name: '', contact: '', info: '' },
  recipient: { name: '', contact: '', info: '' },
}

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()
  const [isFinished, setIsFinished] = React.useState(false)
  const [formState, setState] = React.useState(initialState)
  const [showErrorMessage, setErrorState] = React.useState({
    pickup: false,
    delivery: false,
  })
  const setUIState = stores.ui((state) => state.dispatch)

  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setState)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (!formState.pickup.lat || !formState.pickup.lon) {
      setErrorState((showErrorMessage) => ({
        ...showErrorMessage,
        pickup: true,
      }))
      return false
    }
    if (!formState.delivery.lat || !formState.delivery.lon) {
      setErrorState((showErrorMessage) => ({
        ...showErrorMessage,
        delivery: true,
      }))
      return false
    }

    onSubmit({
      ...formState,
      measurement:
        formState.measurement &&
        formState.measurement.split('x').map(parseFloat),
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
          setErrorState={setErrorState}
          showErrorMessage={showErrorMessage}
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
