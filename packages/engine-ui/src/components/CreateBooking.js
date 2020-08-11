import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from './Elements'
import Form from './forms/CreateBooking'

import 'react-datepicker/dist/react-datepicker.css'

const CreateBooking = ({ createBooking }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    pickup: { name: '', coordinates: [] },
    delivery: { name: '', coordinates: [] },
    deliverAtLatest: undefined,
  })

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (
      !formState.pickup.coordinates.length ||
      !formState.delivery.coordinates.length
    )
      return false
    const [pickupLng, pickupLat] = formState.pickup.coordinates
    const [deliveryLng, deliveryLat] = formState.delivery.coordinates

    createBooking({
      pickup: [pickupLat, pickupLng],
      delivery: [deliveryLat, deliveryLng],
      deliverAtLatest: formState.deliverAtLatest,
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
