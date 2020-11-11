import React from 'react'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import * as eventHandlers from './eventHandlers'
import { useHistory } from 'react-router-dom'

const Component = ({
  onChangeHandler,
  onSubmitHandler,
  state,
  dispatch,
  formErrors,
  setFormErrors,
  parcelSizePresets,
}) => {
  const history = useHistory()
  const [useCustomSize, setUseCustomSize] = React.useState(false)
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({
    pickup: false,
    delivery: false,
  })

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

  const handleFragileParcelChange = () => {
    onChangeHandler((currentState) => ({
      ...currentState,
      fragile: !currentState.fragile,
    }))
  }

  const handleParcelSizeSelectChange = (e) => {
    if (e.target.value === 'custom') {
      setUseCustomSize(!useCustomSize)
      return onChangeHandler((currentState) => ({
        ...currentState,
        size: {
          weight: '',
          measurements: '',
        },
      }))
    }

    return onChangeHandler((currentState) => ({
      ...currentState,
      size: parcelSizePresets[e.target.value],
    }))
  }

  const parcelSizeToHumanReadable = (name) => {
    switch (name) {
      case 'small':
        return 'Liten'
      case 'medium':
        return 'Medium'
      case 'big':
        return 'Stor'
    }
  }

  const parcelSizeSelectOptions = Object.entries(parcelSizePresets)
    .map(([name, { weight, measurements }]) => ({
      value: name,
      label: parcelSizeToHumanReadable(name),
      weight,
      measurements,
    }))
    .concat({ value: 'custom' })

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="parceldetails">
            Paketspecifikationer
          </Elements.Form.Label>
          {/* <FormInputs.TextInput
            name="external-id"
            value={state.externalId}
            placeholder="Referensnummer från avsändare"
            onChangeHandler={eventHandlers.handleTextInputChange(
              'externalId',
              onChangeHandler
            )}
          /> */}

          <FormInputs.ExternalIdSearchInput
            required
            formErrors={formErrors.externalId}
            placeholder="Referensnummer från avsändare"
            // value={state.externalId}
            onFocus={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
            onChangeHandler={eventHandlers.handleAddressInputForBooking(
              'externalId',
              onChangeHandler,
              setFormErrors
            )}
          />
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
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="size" required>
            Välj storlek
          </Elements.Form.Label>
          {!useCustomSize && (
            <FormInputs.ParcelSize
              onChange={handleParcelSizeSelectChange}
              options={parcelSizeSelectOptions}
            />
          )}
          {useCustomSize && (
            <>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  required
                  name="measurements"
                  value={state.size.measurements}
                  placeholder="Mått (BxHxDcm)"
                  pattern="(\d+)x(\d+)x(\d+)"
                  title="BxHxD cm"
                  onChangeHandler={eventHandlers.handleNestedInputChange(
                    'size',
                    'measurements',
                    onChangeHandler
                  )}
                />
              </Elements.Layout.InputContainer>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  step={1}
                  name="weight"
                  value={state.size.weight}
                  placeholder="Vikt (kg)"
                  type="number"
                  required
                  isRequiredInline
                  onChangeHandler={eventHandlers.handleNestedInputChange(
                    'size',
                    'weight',
                    onChangeHandler
                  )}
                />

                <Elements.Buttons.CancelButton
                  padding="0.5rem"
                  style={{
                    marginTop: '0.5rem',
                  }}
                  onClick={() => setUseCustomSize(!useCustomSize)}
                >
                  Återgå till förval
                </Elements.Buttons.CancelButton>
              </Elements.Layout.InputContainer>
            </>
          )}
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="pickup">
          Upphämtning
        </Elements.Form.Label>
        <FormInputs.AddressSearchInput
          required
          formErrors={formErrors.pickup}
          placeholder="Adress (sök eller klicka på karta)"
          value={state.pickup.name}
          onFocus={() =>
            dispatch({
              type: 'focusInput',
              payload: 'start',
            })
          }
          onChangeHandler={eventHandlers.handleAddressInputForBooking(
            'pickup',
            onChangeHandler,
            setFormErrors
          )}
        />
        {formErrors.pickup && (
          <Elements.Typography.ErrorMessage>
            Kunde inte hitta adressen, försök igen
          </Elements.Typography.ErrorMessage>
        )}
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <FormInputs.TextInput
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          name="sender-info"
          value={state.sender.info}
          onChangeHandler={eventHandlers.handleNestedInputChange(
            'sender',
            'info',
            onChangeHandler
          )}
          placeholder="Ytterligare information, t.ex. portkod"
        />

        <FormInputs.Checkbox
          label="Tidspassning"
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
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
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              name="sendername"
              value={state.sender.name}
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'sender',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
              iconInset
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required htmlFor="sender">
            Kontakt
          </Elements.Form.Label>
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact phone icon"
              src={`${phoneIcon}`}
            />
            <FormInputs.TextInput
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              pattern="^[0-9]*$"
              iconInset
              name="sender"
              value={state.sender.contact}
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'sender',
                'contact',
                onChangeHandler
              )}
              placeholder="Telefonnummer"
              required
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="delivery">
          Avlämning
        </Elements.Form.Label>
        <FormInputs.AddressSearchInput
          placeholder="Adress (sök eller klicka på karta)"
          value={state.delivery.name}
          formErrors={formErrors.delivery}
          onFocus={() =>
            dispatch({
              type: 'focusInput',
              payload: 'end',
            })
          }
          onChangeHandler={eventHandlers.handleAddressInputForBooking(
            'delivery',
            onChangeHandler,
            setFormErrors
          )}
        />
        {formErrors.delivery && (
          <Elements.Typography.ErrorMessage>
            Kunde inte hitta adressen, försök igen
          </Elements.Typography.ErrorMessage>
        )}
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <FormInputs.TextInput
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          name="recipient-info"
          value={state.recipient.info}
          onChangeHandler={eventHandlers.handleNestedInputChange(
            'recipient',
            'info',
            onChangeHandler
          )}
          placeholder="Ytterligare information, t.ex. portkod"
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
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
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              name="recipient-name"
              value={state.recipient.name}
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'recipient',
                'name',
                onChangeHandler
              )}
              placeholder="Namn"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>

        <Elements.Layout.InputContainer>
          <Elements.Form.Label required htmlFor="recipient-contact">
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
              pattern="^[0-9]*$"
              value={state.recipient.contact}
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              onChangeHandler={eventHandlers.handleNestedInputChange(
                'recipient',
                'contact',
                onChangeHandler
              )}
              placeholder="Telefonnummer"
              required
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
