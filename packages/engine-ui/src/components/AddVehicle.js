import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/AddVehicle'
import MainRouteLayout from './layout/MainRouteLayout'
import { UIStateContext } from '../utils/UIStateContext'

const AddVehicle = ({ onSubmit }) => {
  const { state: UIState } = React.useContext(UIStateContext)
  const history = useHistory()
  const [isActive, setActive] = React.useState(false)

  const [formState, setState] = React.useState({
    vehicleType: '',
    id: '',
    capacity: null,
    volume: null,
    weight: null,
    timewindow: { start: null, end: null },
    startPosition: { lat: 61.8172594, lon: 16.0561472 },
    endDestination: null,
    driver: { name: '', contact: '' },
  })

  useEffect(() => {
    if (
      isActive &&
      UIState.lastClickedPosition.lat &&
      UIState.lastClickedPosition.lon
    ) {
      setState((formState) => ({
        ...formState,
        startPosition: UIState.lastClickedPosition,
      }))
    }
  }, [UIState.lastClickedPosition, isActive])

  useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const onSubmitHandler = (event) => {
    event.preventDefault()

    onSubmit({
      ...formState,
      lat: formState.startPosition.lat,
      lon: formState.startPosition.lon,
    })

    history.push('/')
  }

  return (
    <MainRouteLayout redirect="/transports">
      <Elements.Layout.Container>
        <h3>Lägg till transport</h3>
        <Form
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          state={formState}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default AddVehicle
