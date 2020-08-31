import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import NestedMenu from './layout/NestedMenu'

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    id: '',
    measurement: '',
    weight: '',
    cargo: '',
    pickup: { name: '', lat: '', lon: '', timewindow: null },
    delivery: { name: '', lat: '', lon: '', timewindow: null },
    sender: { name: '', contact: '' },
    recipient: { name: '', contact: '' },
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
      pickup: formState.pickup,
      delivery: formState.delivery,
    })

    history.push('/')
  }

  return (
    <NestedMenu>
      <Elements.Layout.Container>
        <h3>Lägg till bokning</h3>
        <Form
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          state={formState}
        />
      </Elements.Layout.Container>
    </NestedMenu>
  )
}
export default CreateBooking
