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
  }, [currentPosition])

  useEffect(() => {
    setActive(true)

    return () => setActive(false)
  })

  const create = (event) => {
    event.preventDefault()
    let position = formState
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)
    
    if (!position.length) {
      console.log('creating vehicle in middle of ljusdal')
      position = [61.8294925,16.0565493]
    }
    addVehicle({ lat: position[0], lon: position[1] })

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
              <Elements.LocationIcon
                alt="Position icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
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
