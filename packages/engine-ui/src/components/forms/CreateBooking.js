import React from 'react'
import Elements from '../Elements'
import locationIcon from '../../assets/location.svg'
import BookingTimeRestriction from './BookingTimeRestriction'
import styled from 'styled-components'
import hooks from '../../hooks'

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

const TimeRestrictionInputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const AddAdditionalTimeRestrictionsButton = styled.button`
  border: none;
  background: transparent;
  font-weight: bold;
  color: currentColor;
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const timeRestrictionInputRef = React.useRef()
  const [
    getSuggestedAddresses,
    suggestedAddresses,
  ] = hooks.useGetSuggestedAddresses({
    pickup: [],
    delivery: [],
  })

  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({ pickup: false, delivery: false })

  const [showDropdown, setShowDropdown] = React.useState({
    pickup: false,
    delivery: false,
  })

  const handleBookingTimeRestrictionChange = (
    type,
    property,
    date,
    targetIndex
  ) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        [type]: {
          ...currentState[type],
          timewindows: [
            ...currentState[type].timewindows,
          ].map((timewindow, index) =>
            index === targetIndex
              ? { ...currentState[type].timewindows[index], [property]: date }
              : timewindow
          ),
        },
      }
    })

  const addTimeRestrictionWindow = (type) =>
    onChangeHandler((currentState) => ({
      ...currentState,
      [type]: {
        ...currentState[type],
        timewindows: [
          ...(currentState[type].timewindows || []),
          { earliest: null, latest: null },
        ],
      },
    }))

  const handleInputChange = (event) => {
    event.persist()

    if (event.target.value.length <= 1) {
      setShowDropdown({ delivery: false, pickup: false })
    }

    getSuggestedAddresses(event.target.name, event.target.value, () =>
      setShowDropdown((currentState) => ({
        ...currentState,
        [event.target.name]: true,
      }))
    )

    return onChangeHandler((currentState) => ({
      ...currentState,
      [event.target.name]: {
        ...currentState[event.target.name],
        name: event.target.value,
      },
    }))
  }

  const handleDropdownSelect = (event, { name, lon, lat }) => {
    event.preventDefault()

    onChangeHandler((currentState) => ({
      ...currentState,
      [event.target.name]: {
        name,
        lon,
        lat,
      },
    }))

    return setShowDropdown({ ...showDropdown, [event.target.name]: false })
  }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.InputContainer className="input cotainer">
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
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() => {
            setShowBookingTimeRestriction((currentState) => ({
              ...currentState,
              pickup: !currentState.pickup,
            }))

            return state.pickup.timewindows
              ? onChangeHandler((currentState) => ({
                  ...currentState,
                  pickup: { ...currentState.pickup, timewindows: null },
                }))
              : addTimeRestrictionWindow('pickup')
          }}
        />

        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup &&
            state.pickup.timewindows &&
            state.pickup.timewindows.map((timewindow, index) => (
              <TimeRestrictionInputPairContainer key={index}>
                <div style={{ width: '49%' }}>
                  <BookingTimeRestriction
                    selected={timewindow.earliest}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(
                        'pickup',
                        'earliest',
                        date,
                        index
                      )
                    }
                    placeholderText="Tidigast"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </div>
                <div style={{ width: '49%' }}>
                  <BookingTimeRestriction
                    selected={timewindow.latest}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(
                        'pickup',
                        'latest',
                        date,
                        index
                      )
                    }
                    placeholderText="Senast"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        withIcon={false}
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </div>
              </TimeRestrictionInputPairContainer>
            ))}
          {showBookingTimeRestriction.pickup && state.pickup.timewindows && (
            <AddAdditionalTimeRestrictionsButton
              type="button"
              onClick={() => addTimeRestrictionWindow('pickup')}
            >
              + Lägg till fler
            </AddAdditionalTimeRestrictionsButton>
          )}
        </TimeRestrictionWrapper>
      </Elements.InputContainer>

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
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() => {
            setShowBookingTimeRestriction((currentState) => ({
              ...currentState,
              delivery: !currentState.delivery,
            }))

            return state.delivery.timewindows
              ? onChangeHandler((currentState) => ({
                  ...currentState,
                  delivery: { ...currentState.delivery, timewindows: null },
                }))
              : addTimeRestrictionWindow('delivery')
          }}
        />

        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery &&
            state.delivery.timewindows &&
            state.delivery.timewindows.map((timewindow, index) => (
              <TimeRestrictionInputPairContainer key={index}>
                <div style={{ width: '49%' }}>
                  <BookingTimeRestriction
                    selected={timewindow.earliest}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(
                        'delivery',
                        'earliest',
                        date,
                        index
                      )
                    }
                    placeholderText="Tidigast"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </div>
                <div style={{ width: '49%' }}>
                  <BookingTimeRestriction
                    selected={timewindow.latest}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(
                        'delivery',
                        'latest',
                        date,
                        index
                      )
                    }
                    placeholderText="Senast"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        withIcon={false}
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </div>
              </TimeRestrictionInputPairContainer>
            ))}
          {showBookingTimeRestriction.delivery && state.delivery.timewindows && (
            <AddAdditionalTimeRestrictionsButton
              type="button"
              onClick={() => addTimeRestrictionWindow('delivery')}
            >
              + Lägg till fler
            </AddAdditionalTimeRestrictionsButton>
          )}
        </TimeRestrictionWrapper>
      </Elements.InputContainer>

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
