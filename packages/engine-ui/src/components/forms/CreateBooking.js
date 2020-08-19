import React from 'react'
import Elements from '../../shared-elements'
import FormInputs from './inputs'
import BookingTimeRestriction from './inputs/BookingTimeRestriction'
import styled from 'styled-components'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'

const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({ pickup: false, delivery: false })

  const handleBookingTimeRestrictionChange = (date, type, property) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        [type]: {
          ...currentState[type],
          timewindow: { ...currentState[type].timewindow, [property]: date },
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
        timewindow: { earliest: null, latest: null },
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

    return state[propertyName].timewindow
      ? onChangeHandler((currentState) => ({
          ...currentState,
          [propertyName]: { ...currentState[propertyName], timewindow: null },
        }))
      : addTimeRestrictionWindow(propertyName)
  }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="parceldetails" />
          <FormInputs.TextInput
            name="id"
            value={state.id}
            placeholder="ID"
            onChangeHandler={handleTextInputChange('id')}
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <Elements.Layout.TextInputPairContainer>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                name="measurement"
                value={state.measurement}
                placeholder="Mått (BxHxD)"
                onChangeHandler={handleTextInputChange('measurement')}
              />
            </Elements.Layout.TextInputPairItem>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                step={0.1}
                name="weight"
                value={state.weight}
                placeholder="Vikt (kg)"
                type="number"
                onChangeHandler={handleTextInputChange('weight')}
              />
            </Elements.Layout.TextInputPairItem>
          </Elements.Layout.TextInputPairContainer>
        </Elements.Layout.InputContainer>

        <Elements.Layout.InputContainer>
          <FormInputs.TextInput
            name="cargo"
            value={state.cargo}
            onChangeHandler={handleTextInputChange('cargo')}
            placeholder="Innehåll"
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <Elements.Form.Label htmlFor="pickup">Upphämtning</Elements.Form.Label>
        <FormInputs.AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 22"
          onChangeHandler={handleDropdownSelect('pickup')}
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup && state.pickup.timewindow && (
            <BookingTimeRestriction
              typeProperty="pickup"
              timewindow={state.pickup.timewindow}
              onChangeHandler={handleBookingTimeRestrictionChange}
            />
          )}
        </TimeRestrictionWrapper>
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="sender-name">
            Avsändare
          </Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <FormInputs.TextInput
              name="sendername"
              value={state.sender.name}
              onChangeHandler={handleContactInputChange('sender', 'name')}
              placeholder="Sportbutiken AB"
              iconInset
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="sender-contact">
            Kontakt
          </Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact phone icon"
              src={`${phoneIcon}`}
            />
            <FormInputs.TextInput
              iconInset
              name="sender"
              type="tel"
              value={state.sender.contact}
              onChangeHandler={handleContactInputChange('sender', 'contact')}
              placeholder="070-123 45 67"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <Elements.Form.Label htmlFor="delivery">Avlämning</Elements.Form.Label>
        <FormInputs.AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 7"
          onChangeHandler={handleDropdownSelect('delivery')}
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('delivery')}
        />

        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery && state.delivery.timewindow && (
            <BookingTimeRestriction
              typeProperty="delivery"
              timewindow={state.delivery.timewindow}
              onChangeHandler={handleBookingTimeRestrictionChange}
            />
          )}
        </TimeRestrictionWrapper>
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="recipient-name">
            Mottagare
          </Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <FormInputs.TextInput
              iconInset
              name="recipient-name"
              value={state.recipient.name}
              onChangeHandler={handleContactInputChange('recipient', 'name')}
              placeholder="Anna Andersson"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="recipient-contact">
            Kontakt
          </Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact phone icon"
              src={`${nameIcon}`}
            />
            <FormInputs.TextInput
              iconInset
              name="recipient-contact"
              type="number"
              value={state.recipient.contact}
              onChangeHandler={handleContactInputChange('recipient', 'contact')}
              placeholder="070-123 45 67"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.ButtonWrapper>
        <Elements.Buttons.CancelButton
          type="button"
          onClick={() => console.log('canceling')}
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton type="submit">
          Lägg till
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </form>
  )
}

export default Component
