import React from 'react'
import Elements from '../Elements'
import AddressSearchInput from './AddressSearchInput'
import BookingTimeRestrictionPair from './BookingTimeRestrictionPair'
import styled from 'styled-components'
import TextInput from './TextInput'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'

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

  const handleTextInputChange = (propertyName) => (event) => {
    event.persist()

    return onChangeHandler((currentState) => ({
      ...currentState,
      [propertyName]: event.target.value,
    }))
  }

  const handleContactInputChange = (propertyName, nestedPropertyName) => (
    event
  ) => {
    event.persist()
    return onChangeHandler((currentState) => ({
      ...currentState,
      [propertyName]: {
        ...currentState[propertyName],
        [nestedPropertyName]: event.target.value,
      },
    }))
  }

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
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="name">Namn på fordon</Elements.Label>
          <TextInput
            name="name"
            value={state.name}
            placeholder="Paketbil"
            onChangeHandler={handleTextInputChange('name')}
          />
        </Elements.InputContainer>
        <Elements.InputContainer>
          <Elements.Label htmlFor="cargo">Kapacitet</Elements.Label>
          <TextInput
            name="cargo"
            value={state.cargo}
            onChangeHandler={handleTextInputChange('cargo')}
            placeholder="Lastvolym"
          />
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="endDestination">Körschema</Elements.Label>
          <Elements.InputContainer>
            <Elements.TextInputPairContainer>
              <Elements.TextInputPairItem>
                <TextInput
                  name="startTime"
                  value={state.startTime}
                  placeholder="Starttid"
                  onChangeHandler={handleTextInputChange('startTime')}
                />
              </Elements.TextInputPairItem>
              <Elements.TextInputPairItem>
                <TextInput
                  name="endTime"
                  value={state.endTime}
                  placeholder="Sluttid"
                  onChangeHandler={handleTextInputChange('endTime')}
                />
              </Elements.TextInputPairItem>
            </Elements.TextInputPairContainer>
          </Elements.InputContainer>
          <AddressSearchInput
            placeholder="Slutposition"
            onChangeHandler={handleDropdownSelect('pickup')}
          />
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="driver">Chaufför</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <TextInput
              iconInset
              name="driver"
              value={state.driver.name}
              onChangeHandler={handleTextInputChange('driver')}
              placeholder="Peter Persson"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
        <Elements.InputContainer>
          <Elements.Label htmlFor="contact">Kontakt</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact number icon"
              src={`${phoneIcon}`}
            />
            <TextInput
              iconInset
              name="contact"
              value={state.driver.contact}
              onChangeHandler={handleTextInputChange('contact')}
              placeholder="070-123 45 67"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>

      <Elements.ButtonWrapper>
        <Elements.CancelButton
          type="button"
          onClick={() => console.log('cancel')}
        >
          Avbryt
        </Elements.CancelButton>
        <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
      </Elements.ButtonWrapper>
    </form>
  )
}

export default Component
