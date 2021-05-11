import React from 'react'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import { useHistory } from 'react-router-dom'
import { Form, FormikProps, useFormikContext } from 'formik'
import { validatePhoneNumber } from './validation'
import * as hooks from '../../hooks'
import OpacityFadeInAnim from '../animations/opacityFadeInAnim'
import { BookingFormState } from '../CreateBooking'
import { shareCurrentLocation } from '../../utils/helpers'
import * as stores from '../../utils/state/stores'

const Component = ({
  dispatch,
  type,
}: {
  dispatch: any
  type?: 'NEW' | 'EDIT'
}) => {
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
  ] = React.useState<{ pickup: boolean; delivery: boolean }>({
    pickup: !!values.pickup.timeWindows?.length || false,
    delivery: !!values.delivery.timeWindows?.length || false,
  })

  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setFieldValue)

  const isMobile = window.innerWidth <= 645

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

  React.useEffect(() => {
    if (currentLocation.lat || currentLocation.lon) {
      type === 'NEW' &&
        setFieldValue('pickup', {
          ...currentLocation,
          name: `${currentLocation.name}, ${currentLocation.county}`,
          street: currentLocation.name,
        })
    }
  }, [currentLocation])

  const [animateFirstBlock, setAnimateFirstBlock] = React.useState(false)
  const [animateSecondBlock, setAnimateSecondBlock] = React.useState(false)

  const doAnimateFirstBlock = React.useCallback(() => {
    setAnimateFirstBlock(true)
  }, [])

  const doAnimateSecondBlock = React.useCallback(() => {
    setAnimateSecondBlock(true)
  }, [])

  React.useEffect(() => {
    if (type === 'EDIT') {
      setAnimateFirstBlock(true)
      setAnimateSecondBlock(true)
    }
  }, [type])

  return (
    <Form autoComplete="off" style={{ width: '309px' }}>
      <Elements.Layout.MarginBottomContainer />
      <div>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required htmlFor="pickup">
            Upphämtning
          </Elements.Form.Label>

          <FormInputs.AddressSearchInput
            id="pickup"
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
            name="pickup.timewindow"
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
            <Elements.Layout.InputContainer>
              <Elements.Layout.InputInnerContainer>
                <Elements.Icons.FormInputIcon
                  alt="Contact phone icon"
                  src={`${phoneIcon}`}
                />
                <FormInputs.TextInput
                  id="sender-name"
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
                onFocus={() => dispatch({ type: 'resetInputClickState' })}
                name="metadata.sender.name"
                placeholder="Namn"
                iconinset="true"
              />
            </Elements.Layout.InputInnerContainer>
          </Elements.Layout.InputContainer>
        </Elements.Layout.InputBlock>
        <Elements.Layout.MarginBottomContainer />
        {!animateFirstBlock && (
          <Elements.Buttons.NeutralButton
            padding="0.7rem 1.8rem"
            onClick={doAnimateFirstBlock}
            marginTop="0rem"
            disabled={
              errors.pickup || errors.metadata?.sender?.contact ? true : false
            }
          >
            Lägg till mottagare
          </Elements.Buttons.NeutralButton>
        )}
      </div>

      <OpacityFadeInAnim animate={animateFirstBlock}>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required htmlFor="delivery">
            Avlämning
          </Elements.Form.Label>
          <FormInputs.AddressSearchInput
            id="delivery"
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
            label="Bokningen behöver lämnas en viss tid"
            name="delivery.timewindow"
            defaultChecked={!!values.delivery.timeWindows?.length}
            onFocus={() => dispatch({ type: 'resetInputClickState' })}
            onChangeHandler={() =>
              handleToggleTimeRestrictionsChange('delivery')
            }
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
            <Elements.Layout.InputContainer>
              <Elements.Layout.InputInnerContainer>
                <Elements.Icons.FormInputIcon
                  alt="Contact phone icon"
                  src={`${nameIcon}`}
                />
                <FormInputs.TextInput
                  id="recipient-name"
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
        {animateFirstBlock && !animateSecondBlock && (
          <>
            <Elements.Buttons.NeutralButton
              marginTop="0rem"
              padding="0.7rem 2rem"
              onClick={doAnimateSecondBlock}
            >
              Ange extra information
            </Elements.Buttons.NeutralButton>
            <Elements.Layout.MarginBottomContainer />
          </>
        )}
        {animateSecondBlock && (
          <OpacityFadeInAnim animate={animateSecondBlock}>
            <Elements.Layout.InputBlock>
              <Elements.Layout.InputContainer>
                <Elements.Form.Label htmlFor="parceldetails">
                  Paketspecifikationer
                </Elements.Form.Label>
                <FormInputs.ExternalIdSearchInput
                  id="parceldetails"
                  placeholder="Referensnummer från avsändare"
                  name="externalId"
                  onFocus={() =>
                    dispatch({
                      type: 'focusInput',
                      payload: 'start',
                    })
                  }
                />
              </Elements.Layout.InputContainer>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  name="metadata.cargo"
                  placeholder="Innehåll"
                />
              </Elements.Layout.InputContainer>
              <Elements.Layout.InputContainer>
                <FormInputs.TextInput
                  name="metadata.customer"
                  placeholder="Kund"
                />
              </Elements.Layout.InputContainer>
            </Elements.Layout.InputBlock>
          </OpacityFadeInAnim>
        )}
        <Elements.Layout.ButtonWrapper>
          <Elements.Buttons.CancelButton
            type="button"
            width={`${isMobile && '48.5%'}`}
            onClick={() => history.push('/bookings')}
          >
            Avbryt
          </Elements.Buttons.CancelButton>
          <Elements.Buttons.SubmitButton
            width={'48.5%'}
            padding="0.75rem 0"
            type="submit"
          >
            {type !== 'EDIT' ? 'Lägg till' : 'Uppdatera'}
          </Elements.Buttons.SubmitButton>
        </Elements.Layout.ButtonWrapper>
      </OpacityFadeInAnim>
    </Form>
  )
}

export default Component
