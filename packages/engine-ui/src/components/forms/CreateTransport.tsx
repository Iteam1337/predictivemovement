import React from 'react'
import { useHistory } from 'react-router-dom'
import nameIcon from '../../assets/contact-name.svg'
import phoneIcon from '../../assets/contact-phone.svg'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import * as eventHandlers from './eventHandlers'
import { FormState } from '../CreateTransport'

const Component = ({
  onChangeHandler,
  onSubmitHandler,
  formState,
  dispatch,
  transportPresets,
}: {
  onChangeHandler: any
  onSubmitHandler: any
  formState: FormState
  dispatch: any
  transportPresets: {
    truck: {
      [s: string]: {
        weight: string
        volume: string
      }
    }
  }
}) => {
  const history = useHistory()
  const [useCustomCapacity, setUseCustomCapacity] = React.useState(false)
  const [showEndPositionInput, setShowEndPositionInput] = React.useState(false)
  const isMobile = window.innerWidth <= 645
  const toggleShowEndPositionInput = () => {
    setShowEndPositionInput((showEndPosition) => !showEndPosition)

    onChangeHandler((currentState: FormState) => ({
      ...currentState,
      endPosition: { lat: undefined, lon: undefined, name: '' },
    }))
  }

  const handleDriverTimeRestrictionChange = (date: string, property: string) =>
    onChangeHandler((currentState: FormState) => ({
      ...currentState,
      timewindow: { ...currentState.timewindow, [property]: date },
    }))

  const handleTransportPresetSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === 'custom') {
      setUseCustomCapacity(!useCustomCapacity)
      return onChangeHandler((currentState: any) => ({
        ...currentState,
        capacity: {
          weight: '',
          volume: '',
        },
      }))
    }
    return onChangeHandler((currentState: any) => ({
      ...currentState,
      capacity: transportPresets.truck[e.target.value],
    }))
  }

  const transportPresetNameToHumanReadable = (name: string) => {
    switch (name) {
      case 'small':
        return 'Liten'
      case 'medium':
        return 'Medium'
      case 'big':
        return 'Stor'
    }
  }

  const transportSelectOptions = Object.entries(transportPresets.truck)
    .map(([name, { weight, volume }]) => ({
      value: name,
      label: transportPresetNameToHumanReadable(name),
      weight,
      volume,
    }))
    .concat({
      value: 'custom',
      label: '',
      weight: '',
      volume: '',
    })

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label>Körschema</Elements.Form.Label>
          <Elements.Layout.TimeRestrictionWrapper>
            <FormInputs.TimeRestriction.TransportTimeRestrictionPair
              handleFocus={() => dispatch({ type: 'resetInputClickState' })}
              timewindow={formState.timewindow}
              onChangeHandler={handleDriverTimeRestrictionChange}
            />
          </Elements.Layout.TimeRestrictionWrapper>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required>Startposition</Elements.Form.Label>
          <FormInputs.AddressSearchInput
            formError={false}
            required
            placeholder="Adress (sök eller klicka på karta)"
            value={formState.startPosition.name}
            onChangeHandler={eventHandlers.handleAddressInput(
              'startPosition',
              onChangeHandler
            )}
            onFocusHandler={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <FormInputs.Checkbox
            label="Slutposition (om inte samma som startposition)"
            onChangeHandler={() => toggleShowEndPositionInput()}
          />

          {showEndPositionInput && formState.endPosition && (
            <FormInputs.AddressSearchInput
              formError={false}
              value={formState.endPosition.name}
              placeholder="Adress (sök eller klicka på karta)"
              onChangeHandler={eventHandlers.handleAddressInput(
                'endPosition',
                onChangeHandler
              )}
              onFocusHandler={() =>
                dispatch({
                  type: 'focusInput',
                  payload: 'end',
                })
              }
            />
          )}
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="profile" required>
            Namn på transport
          </Elements.Form.Label>
          <FormInputs.TextInput
            onFocus={() => dispatch({ type: 'resetInputClickState' })}
            required
            name="profile"
            value={formState.metadata.profile}
            placeholder="Paketbil"
            onChangeHandler={eventHandlers.handleNestedInputChange(
              'metadata',
              'profile',
              onChangeHandler
            )}
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="capacity" required>
            Välj kapacitet
          </Elements.Form.Label>
          {!useCustomCapacity && (
            <FormInputs.TransportCapacity
              onChange={handleTransportPresetSelectChange}
              options={transportSelectOptions}
            />
          )}

          {useCustomCapacity && (
            <>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  onFocus={() => dispatch({ type: 'resetInputClickState' })}
                  step={0.1}
                  min="0"
                  required
                  name="volume"
                  value={formState.capacity.volume}
                  placeholder="Lastvolym (m3)"
                  type="number"
                  onChangeHandler={eventHandlers.handleNestedInputChange(
                    'capacity',
                    'volume',
                    onChangeHandler
                  )}
                />
              </Elements.Layout.InputContainer>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  onFocus={() => dispatch({ type: 'resetInputClickState' })}
                  step={1}
                  min="0"
                  type="number"
                  required
                  name="weight"
                  value={formState.capacity.weight}
                  onChangeHandler={eventHandlers.handleNestedInputChange(
                    'capacity',
                    'weight',
                    onChangeHandler
                  )}
                  placeholder="Maxvikt (kg)"
                />

                <Elements.Buttons.CancelButton
                  padding="0.5rem"
                  style={{
                    marginTop: '0.5rem',
                  }}
                  onClick={() => setUseCustomCapacity(!useCustomCapacity)}
                >
                  Återgå till förval
                </Elements.Buttons.CancelButton>
              </Elements.Layout.InputContainer>
            </>
          )}
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
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'driver',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required htmlFor="contact">
            Kontakt
          </Elements.Form.Label>
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
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'driver',
                'contact',
                onChangeHandler
              )}
              pattern="^(?:0|[+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$"
              required
              title="07... or +46"
              placeholder="Telefonnummer"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.ButtonWrapper isMobile={isMobile}>
        <Elements.Buttons.CancelButton
          type="button"
          width={`${isMobile && '100%'}`}
          marginTop={`${isMobile && '0.7rem'}`}
          onClick={() => history.push('/transports')}
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          width={`${isMobile ? '100%' : '48.5%'}`}
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
