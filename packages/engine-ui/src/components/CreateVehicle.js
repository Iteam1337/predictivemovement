import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import Form from './forms/CreateVehicle'
import MainRouteLayout from './layout/MainRouteLayout'
import hooks from '../utils/hooks'

const CreateVehicle = ({ onSubmit }) => {
  const history = useHistory()
  const [isActive, setActive] = React.useState(false)

  const [formState, setState] = React.useState({
    vehicleType: '',
    id: '',
    capacity: '',
    volume: '',
    weight: '',
    timewindow: { start: null, end: null },
    startPosition: { lat: 61.8172594, lon: 16.0561472, name: '' },
    endPosition: { lat: undefined, lon: undefined, name: '' },
    driver: { name: '', contact: '' },
  })

  hooks.useFormStateWithMapClickControl(
    'startPosition',
    'endPosition',
    setState
  )

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

    history.push('/transports')
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

export default CreateVehicle
