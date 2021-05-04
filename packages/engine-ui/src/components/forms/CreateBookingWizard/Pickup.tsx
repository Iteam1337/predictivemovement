import React from 'react'
import * as Elements from '../../../shared-elements'
import * as FormInputs from '../inputs'
import { FormikProps, useFormikContext } from 'formik'
import { BookingFormState } from '../../CreateBooking'
import * as stores from '../../../utils/state/stores'
import { shareCurrentLocation } from '../../../utils/helpers'
import { validatePhoneNumber } from '../validation'
import phoneIcon from '../../../assets/contact-phone.svg'
import nameIcon from '../../../assets/contact-name.svg'
import { useHistory } from 'react-router-dom'

const Pickup: React.FC<{ dispatch: any }> = ({ dispatch }) => {
  const {
    setFieldValue,
    errors,
    touched,
    values,
  }: FormikProps<BookingFormState> = useFormikContext()
  const history = useHistory()
  const [
    currentLocation,
    setCurrentLocation,
  ] = stores.currentLocation((state) => [state, state.set])
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState<{ pickup: boolean }>({
    pickup: !!values.pickup.timeWindows?.length || false,
  })

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
    <>
      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="pickup">
          Upphämtning
        </Elements.Form.Label>

        <FormInputs.AddressSearchInput
          id="pickup"
          name="pickup"
          placeholder="Adress"
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
          name="metadata.sender.info"
          placeholder="Ytterligare information, t.ex. portkod"
        />

        <FormInputs.Checkbox
          defaultChecked={!!values.pickup.timeWindows?.length}
          label="Bokningen behöver hämtas en viss tid"
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
          <Elements.Form.Label htmlFor="sender-phone">
            Avsändare
          </Elements.Form.Label>
          <Elements.Layout.InputContainer>
            <Elements.Layout.InputInnerContainer>
              <Elements.Icons.FormInputIcon
                alt="Contact phone icon"
                src={`${phoneIcon}`}
              />
              <FormInputs.TextInput
                id="sender-phone"
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
          <Elements.Layout.InputInnerContainer>
            <Elements.Icons.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <FormInputs.TextInput
              name="metadata.sender.name"
              placeholder="Namn"
              iconinset="true"
            />
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.MarginBottomContainer />
      <Elements.Buttons.NeutralButton
        type="button"
        padding="0.7rem 1.8rem"
        width={'100%'}
        marginTop="0rem"
        disabled={
          !touched.pickup || errors.pickup || errors.metadata?.sender?.contact
            ? true
            : false
        }
        onClick={() => history.push('/bookings/add-booking/delivery')}
      >
        Nästa
      </Elements.Buttons.NeutralButton>
    </>
  )
}

export default Pickup
