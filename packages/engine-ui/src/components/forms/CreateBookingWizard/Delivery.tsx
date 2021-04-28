import React from 'react'
import * as Elements from '../../../shared-elements'
import * as FormInputs from '../inputs'
import { FormikProps, useFormikContext } from 'formik'
import { BookingFormState } from '../../CreateBooking'
import { validatePhoneNumber } from '../validation'
import phoneIcon from '../../../assets/contact-phone.svg'
import nameIcon from '../../../assets/contact-name.svg'
import { useHistory } from 'react-router-dom'

const Delivery: React.FC<{ dispatch: any; type?: 'NEW' | 'EDIT' }> = ({
  dispatch,
  type,
}) => {
  const {
    setFieldValue,
    errors,
    touched,
    values,
  }: FormikProps<BookingFormState> = useFormikContext()
  const history = useHistory()
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState<{ delivery: boolean }>({
    delivery: !!values.delivery.timeWindows?.length || false,
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

  if (!values.pickup.name) history.push('/bookings/add-booking/pickup')

  return (
    <>
      <Elements.Layout.InputContainer>
        <Elements.Form.Label required htmlFor="delivery">
          Avlämning
        </Elements.Form.Label>
        <FormInputs.AddressSearchInput
          id="delivery"
          name="delivery"
          placeholder="Adress"
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
          label="Bokningen behöver lämnas en viss tid"
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
          <Elements.Form.Label htmlFor="recipient-phone">
            Mottagare
          </Elements.Form.Label>
          <Elements.Layout.InputContainer>
            <Elements.Layout.InputInnerContainer>
              <Elements.Icons.FormInputIcon
                alt="Contact phone icon"
                src={`${phoneIcon}`}
              />
              <FormInputs.TextInput
                id="recipient-phone"
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
      </Elements.Layout.InputBlock>
      <Elements.Layout.MarginBottomContainer />

      <Elements.Buttons.NeutralButton
        type="button"
        padding="0.7rem 1.8rem"
        width={'100%'}
        marginTop="0rem"
        onClick={() => history.push('/bookings/add-booking/pickup')}
      >
        Föregående
      </Elements.Buttons.NeutralButton>
      <Elements.Buttons.NeutralButton
        type="button"
        padding="0.7rem 1.8rem"
        marginTop="1rem"
        width={'100%'}
        onClick={() => history.push('/bookings/add-booking/submit')}
        disabled={
          !touched.delivery ||
          errors.delivery ||
          errors.metadata?.recipient?.contact
            ? true
            : false
        }
      >
        Ange extra information
      </Elements.Buttons.NeutralButton>
      <Elements.Layout.ButtonWrapper marginTop="1rem">
        <Elements.Buttons.CancelButton
          marginTop="0rem"
          type="button"
          onClick={() => history.push('/bookings')}
          padding="0.75rem 1.25rem"
          width="48.5%"
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          padding="0.75rem 1.25rem"
          width="48.5%"
          type="submit"
          disabled={
            !touched.delivery ||
            errors.delivery ||
            errors.metadata?.recipient?.contact
              ? true
              : false
          }
        >
          {type !== 'EDIT' ? 'Lägg till' : 'Uppdatera'}
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </>
  )
}

export default Delivery
