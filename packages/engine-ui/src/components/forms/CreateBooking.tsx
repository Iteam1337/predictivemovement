import React from 'react'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import { useHistory } from 'react-router-dom'
import { Form, FormikProps, useFormikContext } from 'formik'
import { validatePhoneNumber } from './validation'
import * as hooks from '../../hooks'
import { BookingFormState } from '../CreateBooking'
import { FormBooking } from '../EditBooking/EditBooking'

const getSizePreset = (
  { size: { weight, measurements } }: BookingFormState | FormBooking,
  presets: any
) => {
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
  dispatch,
  parcelSizePresets,
  type,
}: {
  dispatch: any
  parcelSizePresets: {
    [s: string]: {
      weight: number
      measurements: string
    }
  }
  type?: 'NEW' | 'EDIT'
}) => {
  const {
    setFieldValue,
    errors,
    touched,
    values,
  }: FormikProps<BookingFormState> = useFormikContext()
  const history = useHistory()
  const sizePreset = getSizePreset(values, parcelSizePresets) || 'custom'
  const [useCustomSize, setUseCustomSize] = React.useState(
    sizePreset === 'custom'
  )
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState<{ pickup: boolean; delivery: boolean }>({
    pickup: !!values.pickup.timeWindows?.length || false,
    delivery: !!values.delivery.timeWindows?.length || false,
  })

  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setFieldValue)

  const isMobile = window.innerWidth <= 645

  const handleParcelSearchResults = ({
    weight,
    measurements,
  }: {
    weight: number
    measurements: string
  }) => {
    if (!weight || !measurements) return null

    setUseCustomSize(true)
  }

  const addTimeRestrictionWindow = (type: string) =>
    setFieldValue(`${type}.timeWindows`, [{ earliest: null, latest: null }])

  const handleToggleTimeRestrictionsChange = (propertyName: string) => {
    setShowBookingTimeRestriction((currentState: any) => ({
      ...currentState,
      [propertyName]: !currentState[propertyName],
    }))

    return (values as any)[propertyName].timeWindows
      ? setFieldValue(`${propertyName}.timeWindows`, null)
      : addTimeRestrictionWindow(propertyName)
  }

  return (
    <Form autoComplete="off" style={{ width: '309px' }}>
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="parceldetails">
            Paketspecifikationer
          </Elements.Form.Label>
          <FormInputs.ExternalIdSearchInput
            placeholder="Referensnummer från avsändare"
            name="externalId"
            onFocus={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
            onSearchResult={handleParcelSearchResults}
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput name="metadata.cargo" placeholder="Innehåll" />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput name="metadata.customer" placeholder="Kund" />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="size" required>
            Välj storlek
          </Elements.Form.Label>

          <FormInputs.ParcelSize
            parcelSizePresets={parcelSizePresets}
            useCustomSize={useCustomSize}
            setUseCustomSize={setUseCustomSize}
            name="size"
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>

      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="pickup">
          Upphämtning
        </Elements.Form.Label>

        <FormInputs.AddressSearchInput
          name="pickup"
          placeholder="Adress (sök eller klicka på karta)"
          onFocusHandler={() =>
            dispatch({
              type: 'focusInput',
              payload: 'start',
            })
          }
        />
        {errors.pickup && touched.pickup && (
          <Elements.Typography.ErrorMessage>
            {errors.pickup}
          </Elements.Typography.ErrorMessage>
        )}
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <FormInputs.TextInput
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          name="metadata.sender.info"
          placeholder="Ytterligare information, t.ex. portkod"
        />

        <FormInputs.Checkbox
          defaultChecked={!!values.pickup.timeWindows?.length}
          label="Tidspassning"
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <Elements.Layout.TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup && (
            <FormInputs.TimeRestriction.BookingTimeRestrictionPair name="pickup.timeWindows[0]" />
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
              name="metadata.sender.name"
              placeholder="Namn"
              iconinset="true"
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
              iconinset="true"
              name="metadata.sender.contact"
              type="tel"
              placeholder="Telefonnummer"
              validate={validatePhoneNumber}
            />
            {errors.metadata?.sender?.contact &&
              touched.metadata?.sender?.contact && (
                <Elements.Typography.ErrorMessage>
                  {errors.metadata.sender.contact}
                </Elements.Typography.ErrorMessage>
              )}
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="delivery">
          Avlämning
        </Elements.Form.Label>
        <FormInputs.AddressSearchInput
          name="delivery"
          placeholder="Adress (sök eller klicka på karta)"
          onFocusHandler={() =>
            dispatch({
              type: 'focusInput',
              payload: 'end',
            })
          }
        />
        {errors.delivery && touched.delivery && (
          <Elements.Typography.ErrorMessage>
            {errors.delivery}
          </Elements.Typography.ErrorMessage>
        )}
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer style={{ marginBottom: '0.75rem' }}>
        <FormInputs.TextInput
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          name="metadata.recipient.info"
          placeholder="Ytterligare information, t.ex. portkod"
        />
        <FormInputs.Checkbox
          label="Tidspassning"
          defaultChecked={!!values.pickup.timeWindows?.length}
          onFocus={() => dispatch({ type: 'resetInputClickState' })}
          onChangeHandler={() => handleToggleTimeRestrictionsChange('delivery')}
        />
        <Elements.Layout.TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery && (
            <FormInputs.TimeRestriction.BookingTimeRestrictionPair name="delivery.timeWindows[0]" />
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
              iconinset="true"
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              name="metadata.recipient.name"
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
              iconinset="true"
              name="metadata.recipient.contact"
              type="tel"
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              placeholder="Telefonnummer"
              validate={validatePhoneNumber}
            />
            {errors.metadata?.recipient?.contact &&
              touched.metadata?.recipient?.contact && (
                <Elements.Typography.ErrorMessage>
                  {errors.metadata.recipient.contact}
                </Elements.Typography.ErrorMessage>
              )}
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
          {type !== 'EDIT' ? 'Lägg till' : 'Uppdatera'}
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </Form>
  )
}

export default Component
