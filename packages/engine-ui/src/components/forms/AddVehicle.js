import React from 'react'
import { useHistory } from 'react-router-dom'
import nameIcon from '../../assets/contact-name.svg'
import phoneIcon from '../../assets/contact-phone.svg'
import Elements from '../../shared-elements'
import FormInputs from './inputs'
import eventHandlers from './eventHandlers'

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const history = useHistory()

  const handleDriverTimeRestrictionChange = (date, property) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        timewindow: { ...currentState.timewindow, [property]: date },
      }
    })

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="vehicleType">
            Namn på fordon
          </Elements.Form.Label>
          <FormInputs.TextInput
            name="vehicleType"
            value={state.vehicleType}
            placeholder="Paketbil"
            onChangeHandler={eventHandlers.handleTextInputChange(
              'vehicleType',
              onChangeHandler
            )}
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="capacity">
            Kapacitet
          </Elements.Form.Label>
          <FormInputs.TextInput
            name="capacity"
            value={state.capacity}
            onChangeHandler={eventHandlers.handleTextInputChange(
              'capacity',
              onChangeHandler
            )}
            placeholder="Lastvolym"
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label>Körschema</Elements.Form.Label>
          <Elements.Layout.InputContainer>
            <Elements.Layout.TimeRestrictionWrapper>
              <FormInputs.TimeRestriction.VehicleTimeRestrictionPair
                timewindow={state.timewindow}
                onChangeHandler={handleDriverTimeRestrictionChange}
              />
            </Elements.Layout.TimeRestrictionWrapper>
          </Elements.Layout.InputContainer>
          <FormInputs.AddressSearchInput
            placeholder="Slutposition"
            onChangeHandler={eventHandlers.handleDropdownSelect(
              'endDestination',
              onChangeHandler
            )}
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="driver">Chaufför</Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <FormInputs.TextInput
              iconInset
              name="driver"
              value={state.driver.name}
              onChangeHandler={eventHandlers.handleContactInputChange(
                'driver',
                'name',
                onChangeHandler
              )}
              placeholder="Peter Persson"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="contact">Kontakt</Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact number icon"
              src={`${phoneIcon}`}
            />
            <FormInputs.TextInput
              iconInset
              name="contact"
              value={state.driver.contact}
              onChangeHandler={eventHandlers.handleContactInputChange(
                'driver',
                'contact',
                onChangeHandler
              )}
              placeholder="070-123 45 67"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.ButtonWrapper>
        <Elements.Buttons.CancelButton
          type="button"
          onClick={() => history.push('/')}
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
