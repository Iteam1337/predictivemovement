import React from 'react'
import { useHistory } from 'react-router-dom'
import nameIcon from '../../assets/contact-name.svg'
import phoneIcon from '../../assets/contact-phone.svg'
import Elements from '../../shared-elements'
import FormInputs from './inputs'
import eventHandlers from './eventHandlers'

const Component = ({
  onChangeHandler,
  onSubmitHandler,
  formState,
  dispatch,
}) => {
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
          <Elements.Form.Label>Körschema</Elements.Form.Label>
          <Elements.Layout.InputContainer>
            <Elements.Layout.TimeRestrictionWrapper>
              <FormInputs.TimeRestriction.VehicleTimeRestrictionPair
                handleFocus={() => dispatch({ type: 'resetInputClickState' })}
                timewindow={formState.timewindow}
                onChangeHandler={handleDriverTimeRestrictionChange}
              />
            </Elements.Layout.TimeRestrictionWrapper>
          </Elements.Layout.InputContainer>
          <Elements.Layout.InputContainer>
            <Elements.Form.Label required>Startposition</Elements.Form.Label>
            <FormInputs.AddressSearchInput
              required
              placeholder="Adress (sök eller klicka på karta)"
              value={formState.startPosition.name}
              onChangeHandler={eventHandlers.handleAddressInput(
                'startPosition',
                onChangeHandler
              )}
              onFocus={() =>
                dispatch({
                  type: 'focusInput',
                  payload: 'start',
                })
              }
            />
          </Elements.Layout.InputContainer>
          <Elements.Layout.InputContainer>
            <Elements.Form.Label>Slutposition</Elements.Form.Label>
            <FormInputs.AddressSearchInput
              value={formState.endPosition.name}
              placeholder="Adress (sök eller klicka på karta)"
              onChangeHandler={eventHandlers.handleAddressInput(
                'endPosition',
                onChangeHandler
              )}
              onFocus={() =>
                dispatch({
                  type: 'focusInput',
                  payload: 'end',
                })
              }
            />
          </Elements.Layout.InputContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="vehicleType" required>
            Namn på transport
          </Elements.Form.Label>
          <FormInputs.TextInput
            onFocus={() => dispatch({ type: 'resetInputClickState' })}
            name="vehicleType"
            value={formState.vehicleType}
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
          <Elements.Layout.TextInputPairContainer>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                onFocus={() => dispatch({ type: 'resetInputClickState' })}
                step={1}
                min="0"
                name="volume"
                value={formState.volume}
                placeholder="Lastvolym (m3)"
                type="number"
                onChangeHandler={eventHandlers.handleTextInputChange(
                  'volume',
                  onChangeHandler
                )}
              />
            </Elements.Layout.TextInputPairItem>
            <Elements.Layout.TextInputPairItem>
              <FormInputs.TextInput
                onFocus={() => dispatch({ type: 'resetInputClickState' })}
                step={1}
                min="0"
                type="number"
                name="weight"
                value={formState.weight}
                onChangeHandler={eventHandlers.handleTextInputChange(
                  'weight',
                  onChangeHandler
                )}
                placeholder="Maxvikt (kg)"
              />
            </Elements.Layout.TextInputPairItem>
          </Elements.Layout.TextInputPairContainer>
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
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              iconInset
              name="driver"
              value={formState.driver.name}
              onChangeHandler={eventHandlers.handleContactInputChange(
                'driver',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
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
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              iconInset
              name="contact"
              value={formState.driver.contact}
              onChangeHandler={eventHandlers.handleContactInputChange(
                'driver',
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
          onClick={() => history.push('/transports')}
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          width="48.5%"
          padding="0.75rem 0"
          type="submit"
        >
          Lägg till
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </form>
  )
}

export default Component
