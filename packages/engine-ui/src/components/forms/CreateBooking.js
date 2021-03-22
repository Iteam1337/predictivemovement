import React from 'react'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import * as eventHandlers from './eventHandlers'
import { useHistory } from 'react-router-dom'
import { shareCurrentLocation } from '../../utils/helpers'
import * as stores from '../../utils/state/stores'

const getSizePreset = ({ size: { weight, measurements } }, presets) => {
  if (!weight || !measurements) {
    return {
      weight: '',
      measurements: '',
    }
  }

  return Object.keys(presets).find(
    (p) =>
      measurements === presets[p].measurements && weight === presets[p].weight
  )
}

const Component = ({
  onChangeHandler,
  onSubmitHandler,
  state,
  dispatch,
  formErrors,
  setFormErrors,
  parcelSizePresets,
  type,
}) => {
  const history = useHistory()
  const sizePreset = getSizePreset(state, parcelSizePresets) || 'custom'
  const [useCustomSize, setUseCustomSize] = React.useState(
    sizePreset === 'custom'
  )
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({
    pickup: !!state.pickup.timeWindows?.length || false,
    delivery: !!state.delivery.timeWindows?.length || false,
  })

  const [
    currentLocation,
    setCurrentLocation,
  ] = stores.currentLocation((state) => [state, state.set])

  const isMobile = window.innerWidth <= 645

  const handleParcelSearchResults = ({ weight, measurements }) => {
    if (!weight || !measurements) return null

    onChangeHandler((currentState) => ({
      ...currentState,
      size: {
        weight,
        measurements: measurements.length ? measurements.join('x') : null,
      },
    }))
    setUseCustomSize(true)
  }

  const handleBookingTimeRestrictionChange = (date, type, property) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        [type]: {
          ...currentState[type],
          timeWindows: [
            { ...currentState[type].timeWindows[0], [property]: date },
          ],
        },
      }
    })

  const addTimeRestrictionWindow = (type) =>
    onChangeHandler((currentState) => ({
      ...currentState,
      [type]: {
        ...currentState[type],
        timeWindows: [{ earliest: null, latest: null }],
      },
    }))

  const handleToggleTimeRestrictionsChange = (propertyName) => {
    setShowBookingTimeRestriction((currentState) => ({
      ...currentState,
      [propertyName]: !currentState[propertyName],
    }))

    return state[propertyName].timeWindows
      ? onChangeHandler((currentState) => ({
          ...currentState,
          [propertyName]: { ...currentState[propertyName], timeWindows: null },
        }))
      : addTimeRestrictionWindow(propertyName)
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
      default:
        return 'Storlek saknas'
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
    <form
      onSubmit={onSubmitHandler}
      autoComplete="off"
      style={{ width: '309px' }}
    >
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="parceldetails">
            Paketspecifikationer
          </Elements.Form.Label>
          <FormInputs.ExternalIdSearchInput
            placeholder="Referensnummer från avsändare"
            value={state.externalId || ''}
            onFocus={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
            onChangeHandler={eventHandlers.handleTextInputChange(
              'externalId',
              onChangeHandler
            )}
            onSearchResult={handleParcelSearchResults}
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput
            name="cargo"
            value={state.metadata.cargo || ''}
            onChangeHandler={eventHandlers.handleNestedInputChange(
              'metadata',
              'cargo',
              onChangeHandler
            )}
            placeholder="Innehåll"
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput
            name="customer"
            value={state.metadata.customer || ''}
            onChangeHandler={eventHandlers.handleNestedInputChange(
              'metadata',
              'customer',
              onChangeHandler
            )}
            placeholder="Kund"
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
              defaultValue={sizePreset}
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
          onFocusHandler={() =>
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

        {!currentLocation.lon && (
          <Elements.Buttons.NeutralButton
            onClick={(e) => {
              e.preventDefault()
              shareCurrentLocation(setCurrentLocation)
            }}
          >
            Dela din nuvarade position
          </Elements.Buttons.NeutralButton>
        )}
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <FormInputs.TextInput
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          name="sender-info"
          value={state.metadata.sender.info || ''}
          onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
            'sender',
            'info',
            onChangeHandler
          )}
          placeholder="Ytterligare information, t.ex. portkod"
        />

        <FormInputs.Checkbox
          defaultChecked={!!state.pickup.timeWindows?.length}
          label="Tidspassning"
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <Elements.Layout.TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup &&
            state.pickup.timeWindows?.length && (
              <FormInputs.TimeRestriction.BookingTimeRestrictionPair
                typeProperty="pickup"
                timeWindow={state.pickup.timeWindows[0]}
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
              value={state.metadata.sender.name || ''}
              onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
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
              pattern="^[0-9]*$|^-$"
              iconInset
              name="sender"
              value={state.metadata.sender.contact}
              onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
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
          onFocusHandler={() =>
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
          value={state.metadata.recipient.info || ''}
          onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
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
          {showBookingTimeRestriction.delivery &&
            state.delivery.timeWindows?.length && (
              <FormInputs.TimeRestriction.BookingTimeRestrictionPair
                typeProperty="delivery"
                timeWindow={state.delivery.timeWindows[0]}
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
              value={state.metadata.recipient.name || ''}
              onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
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
              pattern="^[0-9]*$|^-$"
              value={state.metadata.recipient.contact}
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              onChangeHandler={eventHandlers.handleMetadataNestedInputChange(
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
      <Elements.Layout.ButtonWrapper isMobile={isMobile}>
        <Elements.Buttons.CancelButton
          type="button"
          width={`${isMobile && '100%'}`}
          marginTop={`${isMobile && '0.7rem'}`}
          onClick={() => history.push('/bookings')}
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          width={`${isMobile ? '100%' : '48.5%'}`}
          padding="0.75rem 0"
          type="submit"
        >
          {type !== 'edit' ? 'Lägg till' : 'Uppdatera'}
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </form>
  )
}

export default Component
