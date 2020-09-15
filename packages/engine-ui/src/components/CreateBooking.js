import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import { UIStateContext } from '../utils/UIStateContext'

const CreateBooking = ({ onSubmit }) => {
  const history = useHistory()
  const { state: UIState, dispatch: UIStateDispatch } = React.useContext(
    UIStateContext
  )

  const [formState, setState] = React.useState({
    id: '',
    measurement: '',
    weight: '',
    cargo: '',
    pickup: { name: '', lat: '', lon: '', timewindow: null },
    delivery: {
      name: '',
      lat: '',
      lon: '',
      timewindow: null,
    },
    sender: { name: '', contact: '' },
    recipient: { name: '', contact: '' },
  })

  React.useEffect(() => {
    /**
     * Listen for a combination of clicks on an
     * input field and on the map.
     * When this happens, set pickup/delivery input
     * to name of address clicked on map.
     */

    if (UIState.lastFocusedInput && UIState.lastClickedPosition.address) {
      const { address, lat, lon } = UIState.lastClickedPosition
      const formattedAddress = `${address.name}, ${address.county}`

      switch (UIState.lastFocusedInput) {
        case 'createbooking:pickup':
          setState((current) => ({
            ...current,
            pickup: { ...current.pickup, name: formattedAddress, lat, lon },
          }))
          break

        case 'createbooking:delivery':
          setState((current) => ({
            ...current,
            delivery: { ...current.delivery, name: formattedAddress, lat, lon },
          }))
          break

        default:
          break
      }

      return UIStateDispatch({ type: 'resetInputClickState' })
    }
  }, [UIStateDispatch, UIState.lastClickedPosition, UIState.lastFocusedInput])

  React.useEffect(() => {
    return () => UIStateDispatch({ type: 'resetInputClickState' })
  }, [UIStateDispatch])

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
