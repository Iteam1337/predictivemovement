import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from './Elements'
import Form from './forms/CreateBooking'

import 'react-datepicker/dist/react-datepicker.css'

const CreateBooking = ({ createBooking }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    id: '',
    measurement: '',
    weight: undefined,
    cargo: '',
    pickup: { name: '', lat: '', lon: '', timewindows: null },
    delivery: { name: '', lat: '', lon: '', timewindows: null },
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

    console.log('this isthe formState: ', formState)

    createBooking({
      ...formState,
      pickup: formState.pickup,
      delivery: formState.delivery,
    })

    history.push('/')
  }

  return (
    <Elements.Container>
      <h3>Lägg till bokning</h3>
      <Form
        onChangeHandler={setState}
        onSubmitHandler={onSubmitHandler}
        state={formState}
      />
    </Elements.Container>
  )
}
export default CreateBooking
