import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import locationIcon from '../assets/location.svg'
import Elements from './Elements'

const AddVehicle = ({ addVehicle, currentPosition }) => {
  const history = useHistory()
  const [formState, setState] = React.useState('')
  const [position, setPosition] = React.useState({})
  const [isActive, setActive] = React.useState(false)

  useEffect(() => {
    if (position.lat && position.lon) {
      setState(`${position.lat},${position.lon}`)
    }
  }, [position])

  useEffect(() => {
    if (isActive && currentPosition.lat && currentPosition.lon) {
      setPosition(currentPosition)
    }
  }, [currentPosition, isActive])

  useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const handleCreateOnEmptyFormState = () => {
    console.log('creating vehicle in middle of ljusdal')
    const basePosition = '61.8294925,16.0565493' // Middle of Ljusdal

    const carPosition = basePosition
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    addVehicle({ lat: carPosition[0], lon: carPosition[1] })

    history.push('/')
  }

  const create = (event) => {
    event.preventDefault()

    if (!formState) {
      return handleCreateOnEmptyFormState()
    }

    const carPosition = formState
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    if (!carPosition.length) return false
    addVehicle({ lat: carPosition[0], lon: carPosition[1] })

    history.push('/')
  }

  return (
    <Elements.Container>
      <h3>Lägg till fordon</h3>
      <form onSubmit={create} autoComplete="on">
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="position">Position</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.FormInputIcon
                alt="Position icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
              iconInset
                name="position"
                type="text"
                value={formState}
                placeholder="61.8294925,16.0565493"
                onChange={(e) => setState(e.target.value)}
              />
            </Elements.InputInnerContainer>
          </Elements.InputContainer>
        </div>
        <Elements.ButtonWrapper>
          <Elements.CancelButton
            type="button"
            onClick={() => history.push('/')}
          >
            Avbryt
          </Elements.CancelButton>
          <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
        </Elements.ButtonWrapper>
      </form>
    </Elements.Container>
  )
}
export default AddVehicle
