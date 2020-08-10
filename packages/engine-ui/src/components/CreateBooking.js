import React from 'react'
import { useHistory } from 'react-router-dom'
import locationIcon from '../assets/location.svg'
import Elements from './Elements'
import styled from 'styled-components'
import BookingTimeRestriction from './BookingTimeRestriction'
import 'react-datepicker/dist/react-datepicker.css'

const DropdownWrapper = styled.div`
  width: 100%;
  z-index: 1;
  position: absolute;
`
const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
`
const TimeRestrictionWrapper = styled.div`
  min-height: 50px;
  margin-bottom: 2rem;
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const CreateBooking = ({ createBooking }) => {
  const history = useHistory()
  const [formState, setState] = React.useState({
    pickup: { name: '', coordinates: [] },
    delivery: { name: '', coordinates: [] },
    deliverAtLatest: undefined,
  })
  const [showDropdown, setShowDropdown] = React.useState({
    pickup: false,
    delivery: false,
  })

  const [bookingTimeRestriction, setBookingTimeRestriction] = React.useState(
    false
  )

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
      deliverAtLatest: formState.deliverAtLatest,
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
      `https://pelias.iteamdev.io/v1/autocomplete?text=${query}`
    )
    const data = await res.json()
    return data
  }

  const handleInputChange = (event) => {
    const name = event.target.name

    if (event.target.value.length <= 1) {
      setShowDropdown({ delivery: false, pickup: false })
    }

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

          return setShowDropdown((currentState) => ({
            ...currentState,
            pickup: true,
          }))

        case 'delivery':
          setSuggestedAddresses({
            delivery: features.map(({ geometry, properties: { name } }) => ({
              name,
              coordinates: geometry.coordinates,
            })),
            pickup: suggestedAddresses.pickup,
          })

          return setShowDropdown((currentState) => ({
            ...currentState,
            delivery: true,
          }))

        default:
          return
      }
    })

    switch (event.target.name) {
      case 'pickup':
        return setState({
          pickup: { name: event.target.value, coordinates: [] },
          delivery: formState.delivery,
        })

      case 'delivery':
        return setState({
          pickup: formState.pickup,
          delivery: { name: event.target.value, coordinates: [] },
        })

      default:
        return
    }
  }

  const handleBookingTimeRestrictionChange = (date) => {
    setState((currentState) => ({
      ...currentState,
      deliverAtLatest: new Date(date),
    }))
  }

  return (
    <Elements.Container>
      <h3>Lägg till bokning</h3>
      <form onSubmit={create} autoComplete="off">
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="pickup">Upphämtning</Elements.Label>
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
            <Elements.Label htmlFor="delivery">Avlämning</Elements.Label>
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
        <div style={{ marginBottom: '0.25rem' }}>
          <Elements.AddFormFieldButton
            onClickHandler={() =>
              setBookingTimeRestriction((currentValue) => !currentValue)
            }
          >
            + Lägg till tidspassning
          </Elements.AddFormFieldButton>
        </div>
        <TimeRestrictionWrapper>
          {bookingTimeRestriction ? (
            <div>
              <Elements.SmallInfo>Lämnas senast:</Elements.SmallInfo>
              <BookingTimeRestriction
                deliverAtLatest={formState.deliverAtLatest || new Date()}
                onChangeHandler={handleBookingTimeRestrictionChange}
              />
            </div>
          ) : (
            <div>
              <Elements.SmallInfo>Ingen tidspassning</Elements.SmallInfo>
            </div>
          )}
        </TimeRestrictionWrapper>

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
