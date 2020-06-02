import React from 'react'
import styled from 'styled-components'
import locationIcon from '../assets/location.svg'

const Container = styled.div`
  margin-bottom: 2rem;
`

const InputContainer = styled.div`
  margin-bottom: 1rem;
`

const InputInnerContainer = styled.div`
  position: relative;
`

const TextInput = styled.input`
  border: none;
  background-color: #f0f3f5;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.875rem;
  padding-left: 2.5rem;
`

const Label = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

const SubmitButton = styled.button`
  padding: 0.75rem 1rem;
  background: #e6f5ff;
  border-radius: 0.75rem;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;

  :hover {
    background: #abd4ed;
  }
`

const LocationIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 12px;
  left: 12.5px;
`

const CreateBooking = ({ createBooking }) => {
  const [formState, setState] = React.useState({
    pickup: '',
    dropoff: '',
  })

  const create = (event) => {
    event.preventDefault()

    const pickup = formState.pickup
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    const dropoff = formState.dropoff
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    if (!pickup.length || !dropoff.length) return false
    createBooking({ pickup, dropoff })
  }

  return (
    <Container>
      <h3>Skapa en ny bokning</h3>
      <form onSubmit={create} autoComplete="on">
        <div>
          <InputContainer>
            <Label htmlFor="pickup">Startpunkt</Label>
            <InputInnerContainer>
              <LocationIcon
                alt="Location pickup icon"
                src={`${locationIcon}`}
              />
              <TextInput
                name="pickup"
                type="text"
                value={formState.pickup}
                placeholder="61.8294925,16.0565493"
                onChange={(e) =>
                  setState({
                    pickup: e.target.value,
                    dropoff: formState.dropoff,
                  })
                }
              />
            </InputInnerContainer>
          </InputContainer>
        </div>
        <div>
          <InputContainer>
            <Label htmlFor="dropoff">Destination</Label>
            <InputInnerContainer>
              <LocationIcon
                alt="Location dropoff icon"
                src={`${locationIcon}`}
              />
              <TextInput
                name="dropoff"
                type="text"
                value={formState.dropoff}
                placeholder="61.8644045,16.001133"
                onChange={(e) =>
                  setState({
                    pickup: formState.pickup,
                    dropoff: e.target.value,
                  })
                }
              />
            </InputInnerContainer>
          </InputContainer>
        </div>
        <div>
          <SubmitButton type="submit">Skapa bokning</SubmitButton>
        </div>
      </form>
    </Container>
  )
}
export default CreateBooking
