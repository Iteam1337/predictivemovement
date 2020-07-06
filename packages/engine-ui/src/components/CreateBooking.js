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
  display: inline-block;
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
    pickup: { name: '', coordinates: [] },
    delivery: { name: '', coordinates: [] },
  })

  const [suggestedAddresses, setSuggestedAddresses] = React.useState({
    pickup: [],
    delivery: [],
  })

  const create = (event) => {
    event.preventDefault()
    const [pickupLng, pickupLat] = formState.pickup.coordinates
    const [deliveryLng, deliveryLat] = formState.delivery.coordinates
    createBooking({
      pickup: [pickupLat, pickupLng],
      delivery: [deliveryLat, deliveryLng],
    })
  }

  const selectFromDropdown = (event, address) => {
    event.preventDefault()
    switch (event.target.name) {
      case 'pickup':
        setState({
          pickup: { name: address.name, coordinates: address.coordinates },
          delivery: formState.delivery,
        })
        break

      case 'delivery':
        setState({
          pickup: formState.pickup,
          delivery: { name: address.name, coordinates: address.coordinates },
        })
        break

      default:
        break
    }
  }

  const findAddress = async (query) => {
    const res = await fetch(
      `https://pelias.iteamdev.io/v1/autocomplete?text=${query}&layers=address`
    )
    const data = await res.json()
    return data
  }

  const handleInputChange = (event) => {
    const name = event.target.name
    console.log('target', event.target.name)
    if (event.target.value.length > 1) {
      findAddress(event.target.value).then(({ features }) => {
        switch (name) {
          case 'pickup':
            setSuggestedAddresses({
              pickup: features.map(({ geometry, properties: { name } }) => ({
                name,
                coordinates: geometry.coordinates,
              })),
              delivery: suggestedAddresses.delivery,
            })
            break
          case 'delivery':
            setSuggestedAddresses({
              delivery: features.map(({ geometry, properties: { name } }) => ({
                name,
                coordinates: geometry.coordinates,
              })),
              pickup: suggestedAddresses.pickup,
            })
            break
        }
      })
    }
    switch (event.target.name) {
      case 'pickup':
        setState({
          pickup: { name: event.target.value, coordinates: [] },
          delivery: formState.delivery,
        })
        break

      case 'delivery':
        setState({
          pickup: formState.pickup,
          delivery: { name: event.target.value, coordinates: [] },
        })
        break

      default:
        break
    }
  }

  return (
    <Container>
      <h3>Skapa en ny bokning</h3>
      <form onSubmit={create} autoComplete="off">
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
                value={formState.pickup.name}
                placeholder="61.8294925,16.0565493"
                onChange={handleInputChange}
              />
              <div
                style={{
                  display: suggestedAddresses.pickup ? 'block' : 'hidden',
                }}
              >
                {suggestedAddresses.pickup.map((address, index) => (
                  <button
                    key={index}
                    name="pickup"
                    onClick={(e) => selectFromDropdown(e, address)}
                  >
                    {address.name}
                  </button>
                ))}
              </div>
            </InputInnerContainer>
          </InputContainer>
        </div>
        <div>
          <InputContainer>
            <Label htmlFor="delivery">Delivery</Label>
            <InputInnerContainer>
              <LocationIcon
                alt="Location delivery icon"
                src={`${locationIcon}`}
              />
              <TextInput
                name="delivery"
                type="text"
                value={formState.delivery.name}
                placeholder="61.8644045,16.001133"
                onChange={handleInputChange}
              />
              <div
                style={{
                  display: suggestedAddresses.delivery ? 'block' : 'hidden',
                }}
              >
                {suggestedAddresses.delivery.map((address, index) => (
                  <button
                    key={index}
                    name="delivery"
                    onClick={(e) => selectFromDropdown(e, address)}
                  >
                    {address.name}
                  </button>
                ))}
              </div>
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
