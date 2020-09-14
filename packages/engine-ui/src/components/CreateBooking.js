import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    id: '',
    measurement: '',
    weight: '',
    cargo: '',
    fragile: false,
    pickup: { name: '', lat: '', lon: '', timewindow: null },
    delivery: { name: '', lat: '', lon: '', timewindow: null },
    sender: { name: '', contact: '', doorCode: '' },
    recipient: { name: '', contact: '', doorCode: '' },
  })

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

    history.push('/bookings')
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
