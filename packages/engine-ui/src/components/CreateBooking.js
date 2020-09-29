import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './CreateSuccess'
import hooks from '../utils/hooks'

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
  sender: { name: '', contact: '', doorCode: '' },
  recipient: { name: '', contact: '', doorCode: '' },
}

const CreateBooking = ({ onSubmit }) => {
  const [hasCreatedBooking, setHasCreatedBooking] = React.useState(true)
  const history = useHistory()
  const [formState, setState] = React.useState(initialState)

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
      measurement:
        formState.measurement &&
        formState.measurement.split('x').map(parseFloat),
    })

    return setHasCreatedBooking(true)
  }

  const handleOnContinue = () => {
    setState(initialState)
    setHasCreatedBooking(false)
  }

  const handleOnClose = () => history.push('/bookings')

  if (hasCreatedBooking)
    return <Success onClose={handleOnClose} onContinue={handleOnContinue} />

  return (
    <MainRouteLayout redirect="/bookings">
      <Elements.Layout.Container>
        <h3>Lägg till bokning</h3>
        <Form
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          state={formState}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default CreateBooking
