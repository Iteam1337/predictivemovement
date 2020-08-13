import React from 'react'
import Elements from '../Elements'
import AddressSearchInput from './AddressSearchInput'
import BookingTimeRestrictionPair from './BookingTimeRestrictionPair'
import styled from 'styled-components'

const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const AddAdditionalTimeRestrictionsButton = styled.button`
  border: none;
  background: transparent;
  font-weight: bold;
  color: currentColor;
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({ pickup: false, delivery: false })

  const handleBookingTimeRestrictionChange = (targetIndex) => (
    date,
    type,
    property
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

  const handleDropdownSelect = (propertyName) => ({ name, lon, lat }) => {
    return onChangeHandler((currentState) => ({
      ...currentState,
      [propertyName]: {
        name,
        lon,
        lat,
      },
    }))
  }

  const handleToggleTimeRestrictionsChange = (propertyName) => {
    setShowBookingTimeRestriction((currentState) => ({
      ...currentState,
      [propertyName]: !currentState[propertyName],
    }))

    return state[propertyName].timewindows
      ? onChangeHandler((currentState) => ({
          ...currentState,
          [propertyName]: { ...currentState[propertyName], timewindows: null },
        }))
      : addTimeRestrictionWindow(propertyName)
  }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.InputContainer className="input cotainer">
        <Elements.Label htmlFor="pickup">Upphämtning</Elements.Label>
        <AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 22"
          onChangeHandler={handleDropdownSelect('pickup')}
        />
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup &&
            state.pickup.timewindows &&
            state.pickup.timewindows.map((timewindow, index) => (
              <BookingTimeRestrictionPair
                typeProperty="pickup"
                key={index}
                timewindow={timewindow}
                onChangeHandler={handleBookingTimeRestrictionChange(index)}
              />
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
        <AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 7"
          onChangeHandler={handleDropdownSelect('delivery')}
        />
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('delivery')}
        />
        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery &&
            state.delivery.timewindows &&
            state.delivery.timewindows.map((timewindow, index) => {
              return (
                <BookingTimeRestrictionPair
                  typeProperty="delivery"
                  key={index}
                  timewindow={timewindow}
                  onChangeHandler={handleBookingTimeRestrictionChange(index)}
                />
              )
            })}
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
