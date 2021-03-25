import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import nameIcon from '../../assets/contact-name.svg'
import phoneIcon from '../../assets/contact-phone.svg'
import * as Elements from '../../shared-elements'
import * as FormInputs from './inputs'
import { FormState } from '../CreateTransport'
import { Form, FormikProps, useFormikContext } from 'formik'
import { validateNotEmpty, validatePhoneNumber } from './validation'
import * as hooks from '../../hooks'

const getCapacityPreset = (
  { volume, weight }: FormState['capacity'],
  transportPresets: { [s: string]: { weight: string; volume: string } }
) =>
  Object.keys(transportPresets).find(
    (p) =>
      volume === transportPresets[p].volume &&
      weight === transportPresets[p].weight
  )

const Component = ({
  dispatch,
  transportPresets,
  type,
}: {
  dispatch: any
  transportPresets: {
    [s: string]: {
      weight: string
      volume: string
    }
  }
  type: 'NEW' | 'EDIT'
}) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
  }: FormikProps<FormState> = useFormikContext()
  const capacityPreset =
    getCapacityPreset(values.capacity, transportPresets) || 'custom'
  const history = useHistory()
  const [useCustomCapacity, setUseCustomCapacity] = React.useState(
    capacityPreset === 'custom'
  )
  const [showEndAddressInput, setShowEndAddressInput] = React.useState(
    !!values.endAddress
  )

  hooks.useFormStateWithMapClickControl(
    'startAddress',
    'endAddress',
    setFieldValue
  )
  const isMobile = window.innerWidth <= 645
  const toggleShowEndAddressInput = () => {
    setShowEndAddressInput((showEndAddress) => !showEndAddress)
    setFieldValue('endAddress', { lat: undefined, lon: undefined, name: '' })
  }

  const { fleet } = useParams<{ fleet: string | undefined }>()

  React.useEffect(() => {
    if (fleet) {
      setFieldValue('metadata.fleet', fleet)
    }
  }, [fleet])

  return (
    <Form autoComplete="off">
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label>Körschema</Elements.Form.Label>
          <Elements.Layout.TimeRestrictionWrapper>
            <FormInputs.TimeRestriction.TransportTimeRestrictionPair
              handleFocus={() => dispatch({ type: 'resetInputClickState' })}
            />
          </Elements.Layout.TimeRestrictionWrapper>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label required>Startposition</Elements.Form.Label>
          <FormInputs.AddressSearchInput
            name="startAddress"
            placeholder="Adress (sök eller klicka på karta)"
            onFocusHandler={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
          />
          {errors.startAddress && touched.startAddress && (
            <Elements.Typography.ErrorMessage>
              {errors.startAddress}
            </Elements.Typography.ErrorMessage>
          )}
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <FormInputs.Checkbox
            defaultChecked={showEndAddressInput}
            label="Slutposition (om inte samma som startposition)"
            onChangeHandler={() => toggleShowEndAddressInput()}
          />

          {showEndAddressInput && values.endAddress && (
            <>
              <FormInputs.AddressSearchInput
                name="endAddress"
                placeholder="Adress (sök eller klicka på karta)"
                onFocusHandler={() =>
                  dispatch({
                    type: 'focusInput',
                    payload: 'end',
                  })
                }
              />
              {errors.endAddress && touched.endAddress && (
                <Elements.Typography.ErrorMessage>
                  {errors.endAddress}
                </Elements.Typography.ErrorMessage>
              )}
            </>
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
            validate={validateNotEmpty}
            name="metadata.profile"
            placeholder="Paketbil"
          />
          {errors.metadata?.profile && touched.metadata?.profile && (
            <Elements.Typography.ErrorMessage>
              {errors.metadata.profile}
            </Elements.Typography.ErrorMessage>
          )}
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="capacity" required>
            Välj kapacitet
          </Elements.Form.Label>

          <FormInputs.TransportCapacity
            transportPresets={transportPresets}
            name="capacity"
            useCustomCapacity={useCustomCapacity}
            setUseCustomCapacity={setUseCustomCapacity}
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
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              iconInset
              name="metadata.driver.name"
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
              iconInset
              name="metadata.driver.contact"
              type="tel"
              onFocus={() => dispatch({ type: 'resetInputClickState' })}
              placeholder="Telefonnummer"
              validate={validatePhoneNumber}
            />
            {errors.metadata?.driver?.contact &&
              touched.metadata?.driver?.contact && (
                <Elements.Typography.ErrorMessage>
                  {errors.metadata.driver.contact}
                </Elements.Typography.ErrorMessage>
              )}
          </Elements.Layout.InputInnerContainer>
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label>Flotta</Elements.Form.Label>
          <FormInputs.FleetInput
            placeholder="Lägg till eller välj en flotta"
            name="metadata.fleet"
          />
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
          {type === 'NEW' ? 'Lägg till' : 'Uppdatera'}
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </Form>
  )
}

export default Component
