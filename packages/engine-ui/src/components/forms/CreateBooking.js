import React from 'react'
import Elements from '../../shared-elements'
import FormInputs from './inputs'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import eventHandlers from './eventHandlers'
import { useHistory } from 'react-router-dom'

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const history = useHistory()
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

  const addTimeRestrictionWindow = (type) =>
    onChangeHandler((currentState) => ({
      ...currentState,
      [type]: {
        ...currentState[type],
        timewindow: { earliest: null, latest: null },
      },
    }))

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
            onChangeHandler={eventHandlers.handleTextInputChange(
              'id',
              onChangeHandler
            )}
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <Elements.Layout.TextInputPairContainer>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                name="measurement"
                value={state.measurement}
                placeholder="Mått (BxHxDcm)"
                onChangeHandler={eventHandlers.handleTextInputChange(
                  'measurement',
                  onChangeHandler
                )}
              />
            </Elements.Layout.TextInputPairItem>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                step={1}
                name="weight"
                value={state.weight}
                placeholder="Vikt (kg)"
                type="number"
                onChangeHandler={eventHandlers.handleTextInputChange(
                  'weight',
                  onChangeHandler
                )}
              />
            </Elements.Layout.TextInputPairItem>
          </Elements.Layout.TextInputPairContainer>
        </Elements.Layout.InputContainer>

        <Elements.Layout.InputContainer>
          <FormInputs.TextInput
            name="cargo"
            value={state.cargo}
            onChangeHandler={eventHandlers.handleTextInputChange(
              'cargo',
              onChangeHandler
            )}
            placeholder="Innehåll"
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <Elements.Form.Label htmlFor="pickup">Upphämtning</Elements.Form.Label>
        <FormInputs.AddressSearchInput
          placeholder="Adress"
          onChangeHandler={eventHandlers.handleDropdownSelect(
            'pickup',
            onChangeHandler
          )}
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <Elements.Layout.TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup && state.pickup.timewindow && (
            <FormInputs.TimeRestriction.BookingTimeRestrictionPair
              typeProperty="pickup"
              timewindow={state.pickup.timewindow}
              onChangeHandler={handleBookingTimeRestrictionChange}
            />
          )}
        </Elements.Layout.TimeRestrictionWrapper>
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
              onChangeHandler={eventHandlers.handleContactInputChange(
                'sender',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
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
              onChangeHandler={eventHandlers.handleContactInputChange(
                'sender',
                'contact',
                onChangeHandler
              )}
              placeholder="Telefonnummer"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <Elements.Form.Label htmlFor="delivery">Avlämning</Elements.Form.Label>
        <FormInputs.AddressSearchInput
          placeholder="Adress"
          onChangeHandler={eventHandlers.handleDropdownSelect(
            'delivery',
            onChangeHandler
          )}
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          onChangeHandler={() =>
            handleToggleTimeRestrictionsChange('delivery', onChangeHandler)
          }
        />
        <Elements.Layout.TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery && state.delivery.timewindow && (
            <FormInputs.TimeRestriction.BookingTimeRestrictionPair
              typeProperty="delivery"
              timewindow={state.delivery.timewindow}
              onChangeHandler={handleBookingTimeRestrictionChange}
            />
          )}
        </Elements.Layout.TimeRestrictionWrapper>
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
              onChangeHandler={eventHandlers.handleContactInputChange(
                'recipient',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
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
              type="tel"
              value={state.recipient.contact}
              onChangeHandler={eventHandlers.handleContactInputChange(
                'recipient',
                'contact',
                onChangeHandler
              )}
              placeholder="Telefonnummer"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.ButtonWrapper>
        <Elements.Buttons.CancelButton
          type="button"
          onClick={() => history.push('/bookings')}
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
