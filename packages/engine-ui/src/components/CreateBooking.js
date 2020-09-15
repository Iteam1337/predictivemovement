import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'

import hooks from '../utils/hooks'

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    id: '',
    measurement: '',
    weight: '',
    cargo: '',
    fragile: false,
    pickup: {
      name: '',
      lat: '',
      lon: '',
      timewindow: null,
      street: '',
      city: '',
    },
    delivery: {
      name: '',
      lat: '',
      lon: '',
      street: '',
      city: '',
      timewindow: null,
    },
    sender: { name: '', contact: '', doorCode: '' },
    recipient: { name: '', contact: '', doorCode: '' },
  })

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
      pickup: formState.pickup,
      delivery: formState.delivery,
    })

    return history.push('/bookings')
  }

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
