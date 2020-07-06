import React from 'react'
import { useHistory } from 'react-router-dom'
import locationIcon from '../assets/location.svg'
import Elements from './Elements'
import styled from 'styled-components'

const DropdownWrapper = styled.div`
  width: 100%;
`
const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
`
const CreateBooking = ({ createBooking }) => {
  const history = useHistory()
  const [formState, setState] = React.useState({
    pickup: { name: '', coordinates: [] },
    delivery: { name: '', coordinates: [] },
  })
  const [showDropdown, setShowDropdown] = React.useState({
    pickup: false,
    delivery: false,
  })

  const [suggestedAddresses, setSuggestedAddresses] = React.useState({
    pickup: [],
    delivery: [],
  })

  const create = (event) => {
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
    })
    history.push('/')
  }

  const selectFromDropdown = (event, address) => {
    event.preventDefault()
    switch (event.target.name) {
      case 'pickup':
        setState({
          pickup: { name: address.name, coordinates: address.coordinates },
          delivery: formState.delivery,
        })
        setShowDropdown({ ...showDropdown, pickup: false })
        break

      case 'delivery':
        setState({
          pickup: formState.pickup,
          delivery: { name: address.name, coordinates: address.coordinates },
        })
        setShowDropdown({ ...showDropdown, delivery: false })
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
            setShowDropdown({ ...showDropdown, pickup: true })
            break
          case 'delivery':
            setSuggestedAddresses({
              delivery: features.map(({ geometry, properties: { name } }) => ({
                name,
                coordinates: geometry.coordinates,
              })),
              pickup: suggestedAddresses.pickup,
            })
            setShowDropdown({ ...showDropdown, delivery: true })
            break
        }
      })
    } else {
      setShowDropdown({ delivery: false, pickup: false })
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
    <Elements.Container>
      <h3>Skapa en ny bokning</h3>
      <form onSubmit={create} autoComplete="off">
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="pickup">Startpunkt</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.LocationIcon
                alt="Location pickup icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
                name="pickup"
                type="text"
                value={formState.pickup.name}
                placeholder="T.ex. BARNSTUGEVÄGEN 9"
                onChange={handleInputChange}
              />

              {showDropdown.pickup && (
                <DropdownWrapper>
                  {suggestedAddresses.pickup.map((address, index) => (
                    <DropdownButton
                      key={index}
                      name="pickup"
                      onClick={(e) => selectFromDropdown(e, address)}
                    >
                      {address.name}
                    </DropdownButton>
                  ))}
                </DropdownWrapper>
              )}
            </Elements.InputInnerContainer>
          </Elements.InputContainer>
        </div>
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="delivery">Delivery</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.LocationIcon
                alt="Location delivery icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
                name="delivery"
                type="text"
                value={formState.delivery.name}
                placeholder="T.ex. BARNSTUGEVÄGEN 7"
                onChange={handleInputChange}
              />
              {showDropdown.delivery && (
                <DropdownWrapper>
                  {suggestedAddresses.delivery.map((address, index) => (
                    <DropdownButton
                      key={index}
                      name="delivery"
                      onClick={(e) => selectFromDropdown(e, address)}
                    >
                      {address.name}
                    </DropdownButton>
                  ))}
                </DropdownWrapper>
              )}
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
export default CreateBooking
