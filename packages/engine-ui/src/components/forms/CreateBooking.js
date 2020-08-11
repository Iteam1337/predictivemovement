import React from 'react'
import Elements from '../Elements'
import locationIcon from '../../assets/location.svg'
import BookingTimeRestriction from '../BookingTimeRestriction'
import styled from 'styled-components'
import helpers from '../../utils/helpers'

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
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const timeRestrictionInputRef = React.useRef()

  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState(false)

  const [showDropdown, setShowDropdown] = React.useState({
    pickup: false,
    delivery: false,
  })

  const [suggestedAddresses, setSuggestedAddresses] = React.useState({
    pickup: [],
    delivery: [],
  })

  const handleBookingTimeRestrictionChange = (date) =>
    onChangeHandler((currentState) => ({
      ...currentState,
      deliverAtLatest: new Date(date),
    }))

  const handleInputChange = (event) => {
    event.persist()

    if (event.target.value.length <= 1) {
      setShowDropdown({ delivery: false, pickup: false })
    }

    helpers.findAddress(event.target.value).then(({ features }) => {
      setSuggestedAddresses((currentState) => ({
        ...currentState,
        [event.target.name]: features.map(
          ({ geometry, properties: { name } }) => ({
            name,
            coordinates: geometry.coordinates,
          })
        ),
      }))
      return setShowDropdown((currentState) => ({
        ...currentState,
        [event.target.name]: true,
      }))
    })

    return onChangeHandler((currentState) => ({
      ...currentState,
      [event.target.name]: { name: event.target.value, coordinates: [] },
    }))
  }

  const handleDropdownSelect = (event, address) => {
    event.preventDefault()
    switch (event.target.name) {
      case 'pickup':
        onChangeHandler((currentState) => ({
          ...currentState,
          pickup: { name: address.name, coordinates: address.coordinates },
        }))

        return setShowDropdown({ ...showDropdown, pickup: false })

      case 'delivery':
        onChangeHandler((currentState) => ({
          ...currentState,
          delivery: { name: address.name, coordinates: address.coordinates },
        }))

        return setShowDropdown({ ...showDropdown, delivery: false })

      default:
        return
    }
  }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <div>
        <Elements.InputContainer>
          <Elements.Label htmlFor="pickup">Upphämtning</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Location pickup icon"
              src={`${locationIcon}`}
            />
            <Elements.TextInput
              name="pickup"
              type="text"
              value={state.pickup.name}
              placeholder="T.ex. BARNSTUGEVÄGEN 9"
              onChange={handleInputChange}
              iconInset
            />

            {showDropdown.pickup && (
              <DropdownWrapper>
                {suggestedAddresses.pickup.map((address, index) => (
                  <DropdownButton
                    key={index}
                    name="pickup"
                    onClick={(e) => handleDropdownSelect(e, address)}
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
            <Elements.FormInputIcon
              alt="Location delivery icon"
              src={`${locationIcon}`}
            />
            <Elements.TextInput
              name="delivery"
              type="text"
              value={state.delivery.name}
              placeholder="T.ex. BARNSTUGEVÄGEN 7"
              onChange={handleInputChange}
              iconInset
            />
            {showDropdown.delivery && (
              <DropdownWrapper>
                {suggestedAddresses.delivery.map((address, index) => (
                  <DropdownButton
                    key={index}
                    name="delivery"
                    onClick={(e) => handleDropdownSelect(e, address)}
                  >
                    {address.name}
                  </DropdownButton>
                ))}
              </DropdownWrapper>
            )}
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </div>

      <Elements.Checkbox
        label="Tidspassning"
        onChangeHandler={() => {
          setShowBookingTimeRestriction((currentValue) => !currentValue)
          return onChangeHandler((currentState) => ({
            ...currentState,
            deliverAtLatest: undefined,
          }))
        }}
      />

      <TimeRestrictionWrapper>
        {showBookingTimeRestriction && (
          <BookingTimeRestriction
            deliverAtLatest={state.deliverAtLatest}
            onChangeHandler={handleBookingTimeRestrictionChange}
            inputElement={
              <Elements.TimeRestrictionDateInput
                ref={timeRestrictionInputRef}
              />
            }
          />
        )}
      </TimeRestrictionWrapper>

      <Elements.ButtonWrapper>
        <Elements.CancelButton
          type="button"
          onClick={() => console.log('canceling')}
        >
          Avbryt
        </Elements.CancelButton>
        <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
      </Elements.ButtonWrapper>
    </form>
  )
}

export default Component
